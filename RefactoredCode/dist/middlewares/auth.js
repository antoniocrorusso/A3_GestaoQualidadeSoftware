"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const bdConnection_1 = __importDefault(require("../services/bdConnection"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authentication = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        res.status(401).json({ mensagem: 'Faça login para utilizar esse recurso.' });
        return;
    }
    const token = authorization.split(' ')[1];
    if (!token) {
        res.status(401).json({ mensagem: 'Faça login para utilizar esse recurso.' });
        return;
    }
    try {
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_PASSWORD);
        const existingUser = await (0, bdConnection_1.default)('users').where({ id: user.id }).first();
        if (!existingUser) {
            res.status(401).json({ mensagem: "Usuário não autorizado" });
            return;
        }
        req.user = existingUser;
        next();
    }
    catch (error) {
        res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
    }
};
exports.authentication = authentication;
