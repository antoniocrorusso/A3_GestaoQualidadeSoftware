import knex from '../services/bdConnection';
import { Request, Response, NextFunction } from 'express';
import { Patient } from '../types/patient';
import * as Joi from 'joi';

interface PatientRequest extends Request {
    patient?: Patient;
}

export const validatePatientSchema = (schema: Joi.Schema) => {
    return (req: PatientRequest, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errorMessages = error.details.map(detail => ({
                message: detail.message,
                field: detail.context?.key
            }));
            return res.status(400).json({ errors: errorMessages });
        }

        next();
    };
};