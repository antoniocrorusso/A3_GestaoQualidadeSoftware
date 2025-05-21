import knex from '@/services/bdConnection';
import { Patient } from '@/types/patient';
import { formatDateToInput } from '@/utils/formatDate';
import { Request, Response } from 'express';

export const listPatients = async (req: Request, res: Response): Promise<void> => {
    try {
        const patientsList = await knex('patients');
        res.status(200).json(patientsList);
    } catch (error) {
        res.status(500).json('Erro interno do servidor.');
    }
};

export const registerPatient = async (req: Request, res: Response): Promise<void> => {
    const patientData: Omit<Patient, 'id' | 'is_active'> = req.body;
    const { birth_date: rawDate } = patientData;
    const birth_date = formatDateToInput(rawDate);

    try {
        const existingPatient = await knex('patients').where({ cpf: patientData.cpf }).first();
        if (existingPatient) {
            res.status(400).json('Paciente com esse CPF já cadastrado.');
            return;
        }

        await knex('patients').insert({ ...patientData, birth_date });
        res.status(201).json(`Paciente "${patientData.name}" cadastrado com sucesso.`);
    } catch (error) {
        res.status(500).json('Erro interno do servidor.');
    }
};

export const editPatient = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const patientData: Omit<Patient, 'id' | 'is_active'> = req.body;
    const { birth_date: rawDate } = patientData;
    const birth_date = formatDateToInput(rawDate);

    try {
        const existingPatient = await knex('patients').where({ id }).first();
        if (!existingPatient) {
            res.status(404).json('Paciente não encontrado.');
            return;
        }

        const existingCPF = await knex('patients').where({ cpf: patientData.cpf }).first();
        if (existingCPF && existingCPF.id !== Number(id)) {
            res.status(400).json('Já existe um paciente com este CPF cadastrado.');
            return;
        }

        await knex('patients').update({ ...patientData, birth_date }).where({ id });
        res.status(200).json('Dados do paciente atualizados com sucesso.');
    } catch (error) {
        res.status(500).json('Erro interno do servidor.');
    }
};

export const inactivatePatient = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const patient = await knex('patients').where({ id }).first();
        if (!patient) {
            res.status(404).json('Paciente não encontrado.');
            return;
        }

        await knex('patients').update({ is_active: false }).where({ id });
        res.status(200).json('Paciente inativado com sucesso.');
    } catch (error) {
        res.status(500).json('Erro interno do servidor.');
    }
};

export const activatePatient = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const patient = await knex('patients').where({ id }).first();
        if (!patient) {
            res.status(404).json('Paciente não encontrado.');
            return;
        }

        await knex('patients').update({ is_active: true }).where({ id });
        res.status(200).json('Paciente ativado com sucesso.');
    } catch (error) {
        res.status(500).json('Erro interno do servidor.');
    }
};
