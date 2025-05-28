import { validatePatientSchema } from "../../src/middlewares/patients";
import { registerPatientSchema } from "../../src/schemas/patients";
import { Request, Response } from "express";

//Like the other test suites, I mocked the Request/Response.

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("validatePatientSchema", () => {
  const middleware = validatePatientSchema(registerPatientSchema);

  test("case: Call next when patient data is valid", () => {
    const req = {
      body: {
        name: "Alice Silva",
        birth_date: "1995-11-10",
        gender: "Feminino",
        cpf: "74292807060",
        address_line: "Rua ABC",
      },
    } as Request;

    const res = mockRes();
    const next = jest.fn();

    middleware(req, res, next);

    // Expected actions: Call next and don't set a error status.
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test("case: Return code 400 when name is empty", () => {
    const req = {
      body: {
        name: "",
        birth_date: "1900-01-01",
        gender: "Masculino",
        cpf: "12345678901",
        address_line: "Rua A sem fim",
      },
    } as Request;
    const res = mockRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    // Expected status error messages.
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringContaining("O nome deve ser preenchido."),
        }),
      ]),
    });
    expect(next).not.toHaveBeenCalled(); // Expected to not call the next.
  });

  test("case: Return code 400 when CPF is invalid", () => {
    const req = {
      body: {
        name: "Joao Inexistente",
        birth_date: "1900-01-01",
        gender: "Masculino",
        cpf: "123",
        address_line: "Rua A sem fim",
      },
    } as Request;
    const res = mockRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    // Expected status error messages.
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringContaining("O CPF deve conter 11 dígitos"),
        }),
      ]),
    });
    expect(next).not.toHaveBeenCalled(); // Expected to not call the next.
  });

  test("case: Return code 400 when birth_date is in the future", () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split('T')[0];

    const req = {
      body: {
        name: "Alice Silva",
        birth_date: futureDate,
        gender: "Feminino",
        cpf: "74292807060",
        address_line: "Rua ABC",
      },
    } as Request;
    const res = mockRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    // Expected status error messages.
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringContaining("A data de nascimento não deve ser posterior ao dia de hoje."),
        }),
      ]),
    });
    expect(next).not.toHaveBeenCalled(); // Expected to not call the next.
  });
});
