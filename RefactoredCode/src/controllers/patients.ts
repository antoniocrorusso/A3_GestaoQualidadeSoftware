import { Request, Response } from 'express';
import { BaseController } from './baseController';
import { PatientService } from '../services/PatientService';
import { PatientRepository } from '../repositories/PatientRepository';
import { formatDateToInput } from '../utils/formatDate';

export class PatientController extends BaseController {
    private patientService: PatientService;

    constructor(patientService?: PatientService) {
        super();
        this.patientService = patientService || new PatientService(new PatientRepository());
    }

    private handleError(res: Response, error: unknown, defaultMessage: string, statusCode: number = 400): void {
        if (error instanceof Error) {
            res.status(statusCode).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    public listPatients = async (req: Request, res: Response): Promise<void> => {
        try {
            const patients = await this.patientService.getAllPatients();
            res.status(200).json(patients);
        } catch (error) {
            this.handleError(res, error, 'Erro ao listar pacientes');
        }
    };

    public registerPatient = async (req: Request, res: Response): Promise<void> => {
        try {
            const patientData = req.body;
            const patient = await this.patientService.createPatient({
                ...patientData,
                birthDate: formatDateToInput(patientData.birth_date)
            });
            res.status(201).json({
                success: true,
                message: `Paciente "${patient.name}" cadastrado com sucesso.`,
                data: patient
            });
        } catch (error) {
            this.handleError(res, error, 'Erro ao cadastrar paciente');
        }
    };

    public editPatient = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const patientData = req.body;

            const updatedPatient = await this.patientService.updatePatient(Number(id), {
                ...patientData,
                birthDate: patientData.birth_date ? formatDateToInput(patientData.birth_date) : undefined
            });

            res.status(200).json({
                success: true,
                message: 'Dados do paciente atualizados com sucesso.',
                data: updatedPatient
            });
        } catch (error) {
            this.handleError(res, error, 'Erro ao atualizar paciente');
        }
    };

    public inactivatePatient = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.patientService.togglePatientStatus(Number(id), false);
            res.status(200).json({
                success: true,
                message: 'Paciente inativado com sucesso.'
            });
        } catch (error) {
            this.handleError(res, error, 'Erro ao inativar paciente');
        }
    };

    public activatePatient = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.patientService.togglePatientStatus(Number(id), true);
            res.status(200).json({
                success: true,
                message: 'Paciente ativado com sucesso.'
            });
        } catch (error) {
            this.handleError(res, error, 'Erro ao ativar paciente');
        }
    };

    public getPatientById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const patient = await this.patientService.getPatientById(Number(id));
            if (!patient) {
                res.status(404).json({ error: 'Paciente não encontrado' });
                return;
            }
            res.status(200).json(patient);
        } catch (error) {
            this.handleError(res, error, 'Erro ao buscar paciente');
        }
    };
}

export const patientController = new PatientController();
