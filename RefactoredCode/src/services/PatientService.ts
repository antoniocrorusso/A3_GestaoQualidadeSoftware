import { Patient } from '../entities/patient';
import { IPatientRepository } from '../repositories/PatientRepository';

export class PatientService {
    constructor(private repository: IPatientRepository) { }

    async getAllPatients(): Promise<Patient[]> {
        try {
            return await this.repository.findAll();
        } catch (error) {
            throw new Error('Erro ao buscar pacientes.');
        }
    }

    async getPatientById(id: number): Promise<Patient | null> {
        try {
            if (!id || isNaN(id)) {
                throw new Error('ID do paciente inválido.');
            }
            return await this.repository.findById(id);
        } catch (error) {
            throw new Error('Erro ao buscar paciente.');
        }
    }

    async createPatient(patientData: Omit<Patient, 'id'>): Promise<Patient> {
        try {
            const existingPatient = await this.repository.findByCpf(patientData.cpf);
            if (existingPatient) {
                throw new Error('Já existe um paciente com este CPF cadastrado.');
            }

            const patient = new Patient(patientData);

            return await this.repository.create(patient);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro ao criar paciente.');
        }
    }

    async updatePatient(id: number, patientData: Patient): Promise<Patient> {
        try {
            if (!id || isNaN(id)) {
                throw new Error('ID do paciente inválido.');
            }

            const existingPatient = await this.repository.findById(id);
            if (!existingPatient) {
                throw new Error('Paciente não encontrado.');
            }

            const patientWithSameCpf = await this.repository.findByCpf(patientData.cpf);
            if (patientWithSameCpf && patientWithSameCpf.id !== id) {
                throw new Error('Já existe um paciente com este CPF cadastrado.');
            }

            const updatedPatient = await this.repository.update(id, patientData);
            if (!updatedPatient) {
                throw new Error('Falha ao atualizar o paciente.');
            }

            return updatedPatient;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro ao atualizar paciente.');
        }
    }

    async togglePatientStatus(id: number, active: boolean): Promise<boolean> {
        try {
            if (!id || isNaN(id)) {
                throw new Error('ID do paciente inválido.');
            }

            const patient = await this.repository.findById(id);
            if (!patient) {
                throw new Error('Paciente não encontrado.');
            }

            return await this.repository.toggleStatus(id, active);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro ao alternar status do paciente.');
        }
    }
}
