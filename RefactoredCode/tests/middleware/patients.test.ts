import { validatePatientSchema } from "../../src/middlewares/patients";
import Joi from "joi";
import { Request, Response, NextFunction } from "express";

//Like the other test suites, I mocked the Request/Response.

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("validatePatientSchema", () => {
  const schema = Joi.object({
    name: Joi.string().required(),
    cpf: Joi.string().length(11).required(),
  });

  test("case: Call next when patient data is valid", () => {
    const req = { body: { name: "Alice Silva", cpf: "74292807060" } } as Request;
    const res = mockRes();
    const next = jest.fn();

    const middleware = validatePatientSchema(schema);
    middleware(req, res, next);

    // Expected actions: Call next and don't set a error status.
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled(); 
  });

  test("case: Return code 400 when validation fails", () => {
    const req = { body: { name: "", cpf: "123" } } as Request;
    const res = mockRes();
    const next = jest.fn();

    const middleware = validatePatientSchema(schema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    // Expected status error messages.
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([
        expect.objectContaining({ message: expect.stringContaining('"name" is not allowed to be empty'), }),
        expect.objectContaining({ message: expect.stringContaining('"cpf" length must be 11 characters long'), }),
      ]), 
    });
    expect(next).not.toHaveBeenCalled(); // Expected to not call the next.
  });
});
