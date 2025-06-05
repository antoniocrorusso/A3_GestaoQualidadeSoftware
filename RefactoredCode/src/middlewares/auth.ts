import knex from '../services/bdConnection';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../types/user';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

interface AuthenticatedRequest extends Request {
    user?: User;
}

export const authentication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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
        const user = jwt.verify(token, process.env.JWT_PASSWORD as string) as { userId: number; name: string };

        const existingUser = await knex('users').where({ id: user.userId }).first();
        if (!existingUser) {
            res.status(401).json({ mensagem: "Usuário não autorizado" });
            return;
        }
        req.user = existingUser;
        next();
    } catch (error) {
        res.status(401).json({ mensagem: 'Token inválido ou expirado.', error: error });
    }
};
