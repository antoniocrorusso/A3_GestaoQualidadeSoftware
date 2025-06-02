import { User } from "../../src/entities/user";
import bcrypt from "bcrypt";

// Like the users controller and services, we need to mock the password encryption.
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"),
  compare: jest.fn().mockResolvedValue(true)
}));

describe("User Entity Test suite", () => {
  test("Test case: Create a valid user", () => {
    const user = new User({
      id: 1,
      name: "Ana Souza",
      email: "ana@example.com",
      password: "senha123"
    });

    // Expected Answers
    expect(user.id).toBe(1);
    expect(user.name).toBe("Ana Souza");
    expect(user.email).toBe("ana@example.com");
    expect(user.password).toBe("senha123");
  });

  test("Test case: Validate email format and lowercase it", () => {
    const user = new User({});
    user.email = "ANA@Email.com";

    // Expected Answers
    expect(user.email).toBe("ana@email.com");
  });

  test("Test case: Throw error for invalid email format", () => {
    const user = new User({});

    // Expected Answers    
    expect(() => { user.email = "invalid"; }).toThrow("E-mail inválido");
  });

  test("Test case: Hash password using bcrypt", async () => {
    const user = new User({});
    await user.setPassword("senha123");

    // Expected Answers
    expect(bcrypt.hash).toHaveBeenCalledWith("senha123", 10);
    expect(user.password).toBe("hashedPassword");
  });

  test("Test case: Validate password correctly", async () => {
    const user = new User({ password: "hashedPassword" });
    const isValid = await user.validatePassword("senha123");

    // Expected Answers
    expect(isValid).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith("senha123", "hashedPassword");
  });

  test("Test case: Throw error for weak password", async () => {
    const user = new User({});

    // Expected Answers
    await expect(user.setPassword("123")).rejects.toThrow("A senha deve ter no mínimo 8 caracteres");
  });

  test("Test case: Throw error for empty name", () => {
    const user = new User({});

    // Expected Answers
    expect(() => { user.name = ""; }).toThrow("O nome é obrigatório");
  });
});