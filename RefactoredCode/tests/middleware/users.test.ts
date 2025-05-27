import { validateUserData } from "../../src/middlewares/users";
import { registerUserSchema } from "../../src/schemas/users";
import { Request, Response } from "express";

//Like the other test suites, I mocked the Request/Response.

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("validateUserData", () => {
  const middleware = validateUserData(registerUserSchema);

  test("case: Call next when user data is valid", async () => {
    const req = {
      body: {
        name: "Ana Maria",
        email: "ana@email.com",
        password: "senha123"
      }
    } as Request;

    const res = mockRes();
    const next = jest.fn();

    await middleware(req, res, next);

    // Expected actions: Call next and don"t set a error status.
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test("case: Return code 400 when validation fails", async () => {
    const req = { 
      body: {
        name: "Ana Maria",
        email: "emailinvalido",
        password: "senha123"
      }
    } as Request;

    const res = mockRes();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400); // Expected to call status error.
    expect(res.json).toHaveBeenCalledWith( expect.stringContaining("Informe um e-mail válido.") ); // Expected status error message.
    expect(next).not.toHaveBeenCalled(); // Expected to not call the next.
  });

  test("case: Return code 400 when password is too short", async () => {
    const req = { 
      body: {
        name: "Ana Maria",
        email: "ana@email.com",
        password: "sen"
      }
    } as Request;

    const res = mockRes();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400); // Expected to call status error.
    expect(res.json).toHaveBeenCalledWith( expect.stringContaining("A senha deve ter no mínimo 8 caracteres.") ); // Expected status error message.
    expect(next).not.toHaveBeenCalled(); // Expected to not call the next.
  });
});
