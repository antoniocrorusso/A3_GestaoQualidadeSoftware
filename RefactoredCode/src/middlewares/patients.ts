import knex from '@/services/bdConnection';
import { Request, Response, NextFunction } from 'express';
import { Patient } from '@/types/patient';

interface PatientRequest extends Request {
    patient?: Patient;
}

export const validatePatientExists = async (req: PatientRequest, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    try {
        const patient = await knex('patients').where({ id }).first();
        if (!patient) {
            res.status(404).json('Paciente não encontrado.');
            return;
        }

        req.patient = patient;
        next();
    } catch (error) {
        res.status(500).json('Erro interno do servidor.');
    }
};
