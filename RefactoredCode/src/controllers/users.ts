import knex from '../services/bdConnection';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../types/user';
import { Request, Response } from 'express';
import { BaseController } from './baseController';

dotenv.config();

class UserController extends BaseController {
    private static _instance: UserController;
    private constructor() {
        super();
    }

    public static getInstance(): UserController {
        if (!UserController._instance) {
            UserController._instance = new UserController();
        }
        return UserController._instance;
    }

    public async registerUser(req: Request, res: Response): Promise<void> {
        const userData: Omit<User, 'id'> = req.body;

        const operation = async () => {
            const existingEmail = await knex('users').where({ email: userData.email }).first();
            if (existingEmail) {
                res.status(400).json('Já existe um usuário cadastrado com esse e-mail.');
                return;
            }

            const encryptedPassword = await bcrypt.hash(userData.password, 10);
            await knex('users').insert({ ...userData, password: encryptedPassword });
            res.status(201).json('Usuário cadastrado com sucesso.');
        };
        await this.handleRequest(req, res, operation);
    }

    public async loginUser(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;

        const operation = async () => {
            const existingUser = await knex('users').where({ email }).first();
            if (!existingUser) {
                res.status(401).json('Usuário não cadastrado.');
                return;
            }

            const decryptedPassword = await bcrypt.compare(password, existingUser.password);
            if (!decryptedPassword) {
                res.status(401).json('Senha incorreta.');
                return;
            }

            const token = jwt.sign(
                { id: existingUser.id, name: existingUser.name },
                process.env.JWT_PASSWORD as string,
                { expiresIn: '8h' }
            );

            res.status(200).json({
                message: `Bem vindo, ${existingUser.name.split(' ')[0]}`,
                token
            });
        };
        await this.handleRequest(req, res, operation);
    }
}

export const userController = UserController.getInstance();
