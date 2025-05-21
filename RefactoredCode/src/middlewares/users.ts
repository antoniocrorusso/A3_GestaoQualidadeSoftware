import { Request, Response, NextFunction } from 'express';
import { User } from '@/types/user';
import Joi from 'joi';

interface UserRequest extends Request {
    user?: User;
}

export const validateUserData = (schema: Joi.Schema) => async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        const joiError = error as Joi.ValidationError;
        res.status(400).json(joiError.details[0].message);
    }
};
