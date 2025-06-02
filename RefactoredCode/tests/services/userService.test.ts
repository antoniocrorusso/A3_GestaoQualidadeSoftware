import { UserService } from "../../src/services/UserService";
import { User } from "../../src/entities/user";
import bcrypt from "bcrypt";

// Like the Patients test suite, we mock a new Service Instance before each test to ensure there's no carryover cached erros, that could impact the next one and cause errors.
// We also mock the Repository and the bccrypt, only mirroing it's methods, because we're not testing their methods, but the service ones.
// Finally we mock the User's setPassword and validatePassword from the User class to inject it on our test codes.

// Mocked Users Password methods
export const mockUserSetPassword = () => {
  jest
    .spyOn(User.prototype, "setPassword")
    .mockImplementation(async function (this: any, password: string) {
      this._password = await bcrypt.hash(password, 10);
    });
};

export const mockUserValidatePassword = (shouldSucceed = true) => {
  jest
    .spyOn(User.prototype, "validatePassword")
    .mockImplementation(async function () {
      return shouldSucceed;
    });
};

jest.mock("bcrypt");

describe("UserService", () => {
  let service: UserService;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    service = new UserService(mockRepository);
  });

  afterEach(() => jest.clearAllMocks());

  //Test Cases
  test("case method: createUser - Completed successfully", async () => {
    const userData = new User({
      name: "Janaina",
      email: "janaina@clinica.com",
      password: "senha123",
    });
    mockRepository.findByEmail.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    mockUserSetPassword();
    mockRepository.create.mockImplementation(async (user: User) => user);
    const result = await service.createUser(userData);

    // Expected Answers
    expect(mockRepository.findByEmail).toHaveBeenCalledWith(userData.email);
    expect(bcrypt.hash).toHaveBeenCalledWith("senha123", 10);
    expect(result).toBeInstanceOf(User);
    expect(result.password).toBe("hashedPassword");
  });

  test("case method: createUser - Service error: Email already exists", async () => {
    mockRepository.findByEmail.mockResolvedValue(
      new User({ email: "emailDuplicado@email.com" })
    );

    // Expected Answers
    await expect(
      service.createUser(
        new User({
          name: "emailDuplicado",
          email: "emailDuplicado@email.com",
          password: "senha123",
        })
      )
    ).rejects.toThrow("Já existe um usuário com este e-mail cadastrado.");
  });

  test("case method: createUser - Service error: Generic repository error", async () => {
    mockRepository.findByEmail.mockRejectedValue("DB Error");

    // Expected Answers
    await expect(
      service.createUser(
        new User({
          email: "falha@clinica.com",
          name: "Falha",
          password: "senha123",
        })
      )
    ).rejects.toThrow("Erro ao criar usuário.");
  });

  test("case method: loginUser - Completed Successfully", async () => {
    const email = "login@email.com";
    const password = "senha123";
    const mockUser = new User({
      id: 1,
      email,
      name: "Usuário Logado",
      password: "senhavalida",
    });
    mockRepository.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockUserValidatePassword(true);
    const result = await service.loginUser(email, password);

    // Expected Answers
    expect(mockRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(result).toEqual(mockUser);
  });

  test("case method: loginUser - Service error: Invalid email", async () => {
    mockRepository.findByEmail.mockResolvedValue(null);
    const result = await service.loginUser(
      "invalidlogin@email.com",
      "senha123"
    );

    // Expected Answers
    expect(result).toBeNull();
  });

  test("case method: loginUser - Service error: Invalid password", async () => {
    const mockUser = new User({
      id: 2,
      name: "Senha invalida",
      email: "senhainvalida@email.com",
      password: "senhafajuta",
    });
    mockRepository.findByEmail.mockResolvedValue(mockUser);
    mockUserValidatePassword(false);
    const result = await service.loginUser(
      "senhainvalida@email.com",
      "wrongErrada"
    );

    // Expected Answers
    expect(result).toBeNull();
  });

  test("case method: loginUser - Service error: Generic repository error", async () => {
    mockRepository.findByEmail.mockRejectedValue("Error");

    // Expected Answers
    await expect(service.loginUser("email@fail.com", "fail")).rejects.toThrow(
      "Erro ao autenticar usuário."
    );
  });
});
