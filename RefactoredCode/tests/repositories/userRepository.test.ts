import { UserRepository } from "../../src/repositories/UserRepository";
import { User } from "../../src/entities/user";
import knex from "../../src/services/bdConnection";

// As with the other repository classes that use database functions,
// we mock those to properly test our repository methods.
jest.mock("../../src/services/bdConnection");
const mockedKnex = knex as unknown as jest.Mock;

describe("UserRepository", () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    mockedKnex.mockClear();
  });

  test("test method: findByEmail - returns user if found by email", async () => {
    const userData = {
      id: 1,
      name: "Ana Maria",
      email: "ana@email.com",
      password: "senha123",
    };

    mockedKnex.mockReturnValue({
      where: jest.fn().mockReturnValue({
        first: jest.fn().mockResolvedValue(userData)
      })
    });

    const res = await userRepository.findByEmail("ana@email.com");

    //Expected Answers
    expect(res).toBeInstanceOf(User);
    expect(res?.email).toBe("ana@email.com");
  });

  test("test method: create - inserts new user and returns the protected password", async () => {
    const userData = new User({
      name: "Novo Usuario",
      email: "pessoanova@email.com",
      password: "senha456"
    });

    const inserted = {
      id: 2,
      name: "Novo Usuario",
      email: "pessoanova@email.com",
      password: "hashedPassword"
    };

    mockedKnex.mockReturnValue({
      insert: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([inserted])
      })
    });

    const res = await userRepository.create(userData);

    //Expected Answers
    expect(res).toBeInstanceOf(User);
    expect(res.name).toBe("Novo Usuario");
    expect(res.password).toBe("********"); // OBS: This is the return that was set on the UserRepository class.
  });

  test("test method: findById - returns user if found by ID", async () => {
    const userData = {
      id: 3,
      name: "Ana Souza",
      email: "ana@example.com",
      password: "senha123"
    };

    mockedKnex.mockReturnValue({
      where: jest.fn().mockReturnValue({
        first: jest.fn().mockResolvedValue(userData)
      })
    });

    const res = await userRepository.findById(3);

    //Expected Answers
    expect(res).toBeInstanceOf(User);
    expect(res?.name).toBe("Ana Souza");
  });
});