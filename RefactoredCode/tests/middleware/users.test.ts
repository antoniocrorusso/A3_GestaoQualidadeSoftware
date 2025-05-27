import { validateUserData } from "../../src/middlewares/users";
import Joi from "joi";
import { Request, Response, NextFunction } from "express";

//Like the other test suites, I mocked the Request/Response.

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("validateUserData", () => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });

  test("case: Call next when user data is valid", async () => {
    const req = { body: { email: "email@email.com", password: "senha123" }, } as Request;
    const res = mockRes();
    const next = jest.fn();

    const middleware = validateUserData(schema);
    await middleware(req, res, next);

    // Expected actions: Call next and don't set a error status.
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test("case: Return code 400 when validation fails", async () => {
    const req = { body: { email: "emailinvalido", password: "senha" } } as Request; // Here I set and ivalid email according to the schema create at the top.
    const res = mockRes();
    const next = jest.fn();

    const middleware = validateUserData(schema);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400); // Expected to call status error.
    expect(res.json).toHaveBeenCalledWith( expect.stringContaining('"email" must be a valid email') ); // Expected status error message.
    expect(next).not.toHaveBeenCalled(); // Expected to not call the next.
  });
});
