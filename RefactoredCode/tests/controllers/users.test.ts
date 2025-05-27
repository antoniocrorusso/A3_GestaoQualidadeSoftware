import { userController } from "../../src/controllers/users";
import knex from "../../src/services/bdConnection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//OBS: To test database methods, request and response on the controllers classes, we decided to mock those using jest.

jest.mock("../../src/services/bdConnection", () => {
  const builder = {
    where: jest.fn().mockReturnThis(),
    first: jest.fn(),
    insert: jest.fn(),
  };
  const knex = jest.fn(() => builder);
  Object.assign(knex, builder);
  return { __esModule: true, default: knex };
});

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.spyOn(console, "error").mockImplementation(() => {}); //To ignore console errors.

//NOTE to the group: Since the tests doens't actually instantiate the User class, we need to mock the setPassword method to be used outside an object, 
// to avoid undefined errors. Also, we'll need to set the Test environment manually, to mock it on the test cases.
const injectSetPassword = (req: any) => {
  Object.defineProperty(req.body, "setPassword", {
    value: function (pw: string) {
      this.password = pw;
    },
    writable: true,
    enumerable: false,
  });
};

beforeAll(() => { process.env.JWT_PASSWORD = "A3_UNIT_TEST_ENV"; }); // This is the Mock Test Env.

describe("UserController", () => {
  afterEach(() => jest.clearAllMocks());

  test("case method: registerUser - completed successfully", async () => {
    const req = {
      body: {
        name: "Janaina",
        email: "janaina@clinica.com",
        password: "senha123",
      },
    };

    injectSetPassword(req);
    const res = mockRes();
    (knex.first as jest.Mock).mockResolvedValueOnce(undefined); // Simulate there was no duplicates
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_pw");

    (knex.insert as jest.Mock).mockImplementation((user) => {
      expect(user.password).toBe("hashed_pw");
      return Promise.resolve();
    });

    await userController.registerUser(req as any, res as any);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.stringContaining("Usuário cadastrado")); // Expected answer.
  });

  test("case method: registerUser - error for already existing email", async () => {
    const req = {
      body: {
        name: "emailDuplicado",
        email: "emailDuplicado@email.com",
        password: "senha123",
      },
    };

    injectSetPassword(req);
    const res = mockRes();
    (knex.first as jest.Mock).mockResolvedValueOnce({ id: 1 }); // email exists
    await userController.registerUser(req as any, res as any);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(expect.stringContaining("Já existe um usuário")); // Expected answer.
  });

  test("case method: loginUser - completed successfully", async () => {
    const req = {
      body: {
        email: "login@email.com",
        password: "senha123",
      },
    };
    const res = mockRes();

    (knex.first as jest.Mock).mockResolvedValueOnce({
      id: 1,
      name: "Teste Login",
      password: "hashed_pw",
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mocked_token");
    await userController.loginUser(req as any, res as any);
    expect(bcrypt.compare).toHaveBeenCalledWith("senha123", "hashed_pw");
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 1, name: "Teste Login" },
      "A3_UNIT_TEST_ENV",
      { expiresIn: "8h" }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: "mocked_token" })); // Expected answer.
  });

  test("case method: loginUser - User not found", async () => {
    const req = {
      body: {
        email: "login@email.com",
        password: "senha123",
      },
    };
    const res = mockRes();
    (knex.first as jest.Mock).mockResolvedValueOnce(undefined); // simulate no user found
    await userController.loginUser(req as any, res as any);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.stringContaining("E-mail ou senha inválidos")); // Expected answer.
  });

  test("case method: loginUser - Wrong password", async () => {
    const req = {
      body: {
        email: "login@email.com",
        password: "senha",
      },
    };
    const res = mockRes();

    (knex.first as jest.Mock).mockResolvedValueOnce({
      id: 2,
      name: "Teste Login",
      password: "hashed_pw",
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false); // password check fails
    await userController.loginUser(req as any, res as any);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.stringContaining("E-mail ou senha inválidos")); // Expected answer.
  });
});

// I'm deleting the mocked password test environment after the tests.
afterAll(() => {
  delete process.env.JWT_PASSWORD;
});
