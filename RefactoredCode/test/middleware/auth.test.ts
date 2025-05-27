import { authentication } from "../../src/middlewares/auth";
import knex from "../../src/services/bdConnection";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

//Like the other test suites, I decided to mock the Web token and Request/Response.

jest.mock("../../src/services/bdConnection", () => {
  const builder = {
    where: jest.fn().mockReturnThis(),
    first: jest.fn(),
  };
  const knex = jest.fn(() => builder);
  Object.assign(knex, builder);
  return { __esModule: true, default: knex };
});

jest.mock("jsonwebtoken");

const mockedJwt = jwt as unknown as { verify: jest.Mock<any>; }; // Mock a general return type for web token.

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("authentication", () => {
  afterEach(() => { jest.clearAllMocks(); });

  test("Case: Block when header authorization not provided", async () => {
    const req = { headers: {} } as Request;
    const res = mockRes();
    const next = jest.fn();

    await authentication(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensagem: "Faça login para utilizar esse recurso.", }); // Expected answer from code.
    expect(next).not.toHaveBeenCalled();
  });

  test("case: Block when authorization header doesn't have Bearer", async () => {
    const req = { headers: { authorization: "Token abcdef" } } as Request;
    const res = mockRes();
    const next = jest.fn();

    await authentication(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensagem: "Faça login para utilizar esse recurso.", }); // Expected answer from code.
    expect(next).not.toHaveBeenCalled();
  });

  test("case: Block when token is missing after Bearer", async () => {
    const req = { headers: { authorization: "Bearer " } } as Request;
    const res = mockRes();
    const next = jest.fn();

    await authentication(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensagem: "Faça login para utilizar esse recurso.", }); // Expected answer from code.
    expect(next).not.toHaveBeenCalled();
  });

  test("case: Block when is invalid Token", async () => {
    const req = { headers: { authorization: "Bearer invalidtoken" }, } as Request;
    const res = mockRes();
    const next = jest.fn();

    mockedJwt.verify.mockImplementation(() => { throw new Error("invalid"); });

    await authentication(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensagem: "Token inválido ou expirado.", }); // Expected answer from code.
    expect(next).not.toHaveBeenCalled();
  });

  test("case: Block when user is not authorized", async () => {
    const req = { headers: { authorization: "Bearer validtoken" } } as Request;
    const res = mockRes();
    const next = jest.fn();

    mockedJwt.verify.mockReturnValue({ id: 1, name: "Joao SemRegistro" });
    (knex.first as jest.Mock).mockResolvedValueOnce(undefined); // user not found

    await authentication(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensagem: "Usuário não autorizado", }); // Expected answer from code.
    expect(next).not.toHaveBeenCalled();
  });

  test("case: Operation sucessfull with valid token and user", async () => {
    const req = { headers: { authorization: "Bearer validtoken" }, } as Request & { user?: any };
    const res = mockRes();
    const next = jest.fn();

    const fakeUser = { id: 1, name: "Authorized User" };
    mockedJwt.verify.mockReturnValue({ id: 1, name: "Marcos Registrado" });
    (knex.first as jest.Mock).mockResolvedValueOnce(fakeUser);

    await authentication(req, res, next);

    // Expected answers done here.
    expect(req.user).toEqual(fakeUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
