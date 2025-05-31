import { Request, Response } from "express";
import { UserController } from "../../src/controllers/users";
import { User } from "../../src/entities/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//We mock database methods, request and response, services, we tokens, and encryptions, only mirroing it's methods, 
// because we're not testing their methods, but the controller ones.

jest.mock("../../src/services/UserService");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

//Note to group: we'll need to set the Test environment manually, to mock it on the test cases.
beforeAll(() => { process.env.JWT_PASSWORD = "A3_UNIT_TEST_ENV"; });

let mockService: any;
let userController: UserController;

beforeEach(() => {
  mockService = {
    createUser: jest.fn(),
    loginUser: jest.fn(),
  };

  userController = UserController.createInstanceForTest(mockService);
  (userController as any).userService = mockService;
});

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
    const res = mockRes();
    const hashedPassword = "hashedPassword";
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    const createdUser = new User({ ...req.body, password: hashedPassword });
    mockService.createUser.mockResolvedValue(createdUser);
    await userController.registerUser(req as Request, res as Response);

    // Expected Answers
    expect(bcrypt.hash).toHaveBeenCalledWith("senha123", 10);
    expect(mockService.createUser).toHaveBeenCalledWith(expect.any(User));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdUser);
  });

  test("case method: registerUser - Service error for already existing email", async () => {
    const req = {
      body: {
        name: "emailDuplicado",
        email: "emailDuplicado@email.com",
        password: "senha123",
      },
    };
    const res = mockRes();
    const error = new Error("Já existe um usuário com este e-mail cadastrado.");
    (bcrypt.hash as jest.Mock).mockResolvedValueOnce("hashedPass");
    mockService.createUser.mockRejectedValueOnce(error);
    await userController.registerUser(req as Request, res as Response);

    //Expected Answers
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(error.message);
  });

  test("case method: loginUser - completed successfully", async () => {
    const req = {
      body: {
        email: "login@email.com",
        password: "senha123",
      },
    };
    const res = mockRes();
    const user = new User({ id: 1, name: "Usuário Logado", email: req.body.email, password: req.body.password });
    mockService.loginUser.mockResolvedValueOnce(user);
    (jwt.sign as jest.Mock).mockReturnValue("fake-jwt-token");
    await userController.loginUser(req as Request, res as Response);

    //Expected answers
    expect(mockService.loginUser).toHaveBeenCalledWith(req.body.email, req.body.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: user.id, email: user.email },
      expect.any(String),
      { expiresIn: "24h" }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ msg: `Bem vindo, ${user.name}!`, token: "fake-jwt-token" });
  });

  test("case method: loginUser - Service error: User or password invalid", async () => {
    const req = {
      body: {
        email: "login@email.com",
        password: "senha123",
      },
    };
    const res = mockRes();
    mockService.loginUser.mockResolvedValueOnce(null);
    await userController.loginUser(req as Request, res as Response);

    //Expected Answers
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith("E-mail ou senha inválidos.");
  });

  test("case method: loginUser - Service error: Generic error", async () => {
    const req = {
      body: {
        email: "login@email.com",
        password: "senha",
      },
    };
    const res = mockRes();
    mockService.loginUser.mockRejectedValueOnce(new Error("Erro inesperado"));
    await userController.loginUser(req as Request, res as Response);

    //Expected answers
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith("Erro durante o login.");
  });
});
