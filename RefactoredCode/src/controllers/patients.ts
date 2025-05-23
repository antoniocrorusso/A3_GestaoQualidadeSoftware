import knex from '../services/bdConnection';
import { Patient } from '../types/patient';
import { formatDateToInput } from '../utils/formatDate';
import { Request, Response } from 'express';
import { BaseController } from './baseController';

class PatientController extends BaseController {
    private static _instance: PatientController;
    private constructor() {
        super();
    }

    public static getInstance(): PatientController {
        if (!PatientController._instance) {
            PatientController._instance = new PatientController();
        }
        return PatientController._instance;
    }

    public async listPatients(req: Request, res: Response): Promise<void> {
        const operation = async () => {
            const patientsList = await knex('patients');
            res.status(200).json(patientsList);
        };
        await this.handleRequest(req, res, operation);
    }

    public async registerPatient(req: Request, res: Response): Promise<void> {
        const patientData: Omit<Patient, 'id' | 'active'> = req.body;
        const { birth_date: rawDate } = patientData;
        const birth_date = formatDateToInput(rawDate);

        const operation = async () => {
            const existingPatient = await knex('patients').where({ cpf: patientData.cpf }).first();
            if (existingPatient) {
                res.status(409).json('Já existe um paciente com este CPF cadastrado.');
                return;
            }

            await knex('patients').insert({ ...patientData, birth_date });
            res.status(201).json(`Paciente "${patientData.name}" cadastrado com sucesso.`);
        };
        await this.handleRequest(req, res, operation);
    }

    public async editPatient(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const patientData: Omit<Patient, 'id' | 'active'> = req.body;
        const { birth_date: rawDate } = patientData;
        const birth_date = formatDateToInput(rawDate);

        const operation = async () => {
            const existingPatient = await knex('patients').where({ id }).first();
            if (!existingPatient) {
                res.status(404).json('Paciente não encontrado.');
                return;
            }

            const existingCPF = await knex('patients').where({ cpf: patientData.cpf }).first();
            if (existingCPF && existingCPF.id !== Number(id)) {
                res.status(409).json('Já existe um paciente com este CPF cadastrado.');
                return;
            }

            await knex('patients').update({ ...patientData, birth_date }).where({ id });
            res.status(200).json('Dados do paciente atualizados com sucesso.');
        };
        await this.handleRequest(req, res, operation);
    }

    public async inactivatePatient(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const operation = async () => {
            const patient = await knex('patients').where({ id }).first();
            if (!patient) {
                res.status(404).json('Paciente não encontrado.');
                return;
            }

            await knex('patients').update({ active: false }).where({ id });
            res.status(200).json('Paciente inativado com sucesso.');
        };
        await this.handleRequest(req, res, operation);
    }

    public async activatePatient(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const operation = async () => {
            const patient = await knex('patients').where({ id }).first();
            if (!patient) {
                res.status(404).json('Paciente não encontrado.');
                return;
            }

            await knex('patients').update({ active: true }).where({ id });
            res.status(200).json('Paciente ativado com sucesso.');
        };
        await this.handleRequest(req, res, operation);
    }
}

export const patientController = PatientController.getInstance();
