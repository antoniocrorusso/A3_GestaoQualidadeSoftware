"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bdConnection_1 = __importDefault(require("../services/bdConnection"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const registerUser = async (req, res) => {
    const userData = req.body;
    try {
        const existingEmail = await (0, bdConnection_1.default)('users').where({ email: userData.email }).first();
        if (existingEmail) {
            res.status(400).json('Já existe um usuário cadastrado com esse e-mail.');
            return;
        }
        const encryptedPassword = await bcrypt_1.default.hash(userData.password, 10);
        await (0, bdConnection_1.default)('users').insert({ ...userData, password: encryptedPassword });
        res.status(201).json('Usuário cadastrado com sucesso.');
    }
    catch (error) {
        console.error(error);
        res.status(500).json('Erro no servidor.');
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await (0, bdConnection_1.default)('users').where({ email }).first();
        if (!existingUser) {
            res.status(401).json('Usuario não cadastrado.');
            return;
        }
        const decryptedPassword = await bcrypt_1.default.compare(password, existingUser.password);
        if (!decryptedPassword) {
            res.status(401).json('Senha incorreta.');
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: existingUser.id, name: existingUser.name }, process.env.JWT_PASSWORD, { expiresIn: '8h' });
        const { password: _, ...logedUser } = existingUser;
        res.status(200).json({
            ...logedUser,
            token,
            message: `Bem vindo, ${logedUser.name.split(' ')[0]}`
        });
    }
    catch (error) {
        res.status(500).json('Erro interno do servidor.');
    }
};
exports.loginUser = loginUser;
