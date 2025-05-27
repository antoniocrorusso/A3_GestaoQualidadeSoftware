import { Request, Response } from 'express';
import { BaseController } from './baseController';
import { User } from '../entities/user';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { BaseController } from './baseController';
import { User } from '../entities/user';

dotenv.config();

class UserController extends BaseController {
    private static _instance: UserController;
    private userService: UserService;

    private constructor() {
        super();
        const userRepository = new UserRepository();
        this.userService = new UserService(userRepository);
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
            try {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                const user = new User({
                    ...userData,
                    password: hashedPassword
                });

                const createdUser = await this.userService.createUser(user);
                res.status(201).json(createdUser);
            } catch (error) {
                if (error instanceof Error) {
                    res.status(400).json(error.message);
                    return;
                }
                throw error;
            }
        };
        await this.handleRequest(req, res, operation);
    }

    public async loginUser(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;

        const operation = async () => {
            try {
                const user = await this.userService.loginUser(email, password);
                if (!user) {
                    res.status(401).json('E-mail ou senha inválidos.');
                    return;
                }

                const token = jwt.sign(
                    { userId: user.id, email: user.email },
                    process.env.JWT_PASSWORD as string,
                    { expiresIn: '24h' }
                );

                res.status(200).json({ msg: `Bem vindo, ${user.name}!`, token });
            } catch (error) {
                console.error('Erro durante o login:', error);
                res.status(500).json('Erro durante o login.');
            }
        };
        await this.handleRequest(req, res, operation);
    }
}

export const userController = UserController.getInstance();
