import knex from '../services/bdConnection';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../types/user';
import { Request, Response } from 'express';

dotenv.config();

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const userData: Omit<User, 'id' | 'created_at' | 'updated_at'> = req.body;

    try {
        const existingEmail = await knex('users').where({ email: userData.email }).first();
        if (existingEmail) {
            res.status(400).json('Já existe um usuário cadastrado com esse e-mail.');
            return;
        }

        const encryptedPassword = await bcrypt.hash(userData.password, 10);

        await knex('users').insert({ ...userData, password: encryptedPassword });
        res.status(201).json('Usuário cadastrado com sucesso.');
    } catch (error) {
        console.error(error);
        res.status(500).json('Erro no servidor.');
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const existingUser = await knex('users').where({ email }).first();
        if (!existingUser) {
            res.status(401).json('Usuario não cadastrado.');
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

        const { password: _, ...logedUser } = existingUser;
        res.status(200).json({
            ...logedUser,
            token,
            message: `Bem vindo, ${logedUser.name.split(' ')[0]}`
        });
    } catch (error) {
        res.status(500).json('Erro interno do servidor.');
    }
};
