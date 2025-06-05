import { Patient } from "@/entities/patient";

export interface IPatientRepository {
    findByCpf(cpf: string): Promise<Patient | null>;
    toggleStatus(id: number, active: boolean): Promise<boolean>;
    create(patientData: Omit<Patient, 'id'>): Promise<Patient>;
    update(id: number, patientData: Partial<Patient>): Promise<Patient>;
    findById(id: number): Promise<Patient | null>;
    findAll(): Promise<Patient[]>;
    delete(id: number): Promise<boolean>;
    exists(id: number): Promise<boolean>;
}