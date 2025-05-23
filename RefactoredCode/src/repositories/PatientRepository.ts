import { BaseRepository } from './BaseRepository';
import { Patient } from '../entities/patient';
import knex from '../services/bdConnection';

export interface IPatientRepository {
    findByCpf(cpf: string): Promise<Patient | null>;
    toggleStatus(id: number, active: boolean): Promise<boolean>;
    create(patientData: Omit<Patient, 'id'>): Promise<Patient>;
    update(id: number, patientData: Partial<Patient>): Promise<boolean>;
    findById(id: number): Promise<Patient | null>;
    findAll(): Promise<Patient[]>;
    delete(id: number): Promise<boolean>;
    exists(id: number): Promise<boolean>;
}

export class PatientRepository extends BaseRepository<Patient> implements IPatientRepository {
    constructor() {
        super('patients');
    }

    async findByCpf(cpf: string): Promise<Patient | null> {
        const patient = await knex(this.tableName).where({ cpf }).first();
        return patient ? new Patient(patient) : null;
    }

    async toggleStatus(id: number, active: boolean): Promise<boolean> {
        const count = await knex(this.tableName)
            .where({ id })
            .update({ active });
        return count > 0;
    }

    async create(patientData: Omit<Patient, 'id'>): Promise<Patient> {
        const [created] = await knex(this.tableName).insert(patientData).returning('*');
        return new Patient(created);
    }

    async update(id: number, patientData: Partial<Patient>): Promise<boolean> {
        const count = await knex(this.tableName).where({ id }).update(patientData);
        return count > 0;
    }

    async findById(id: number): Promise<Patient | null> {
        const patient = await knex(this.tableName).where({ id }).first();
        return patient ? new Patient(patient) : null;
    }

    async findAll(): Promise<Patient[]> {
        const patients = await knex(this.tableName).select('*');
        return patients.map(patient => new Patient(patient));
    }

    async delete(id: number): Promise<boolean> {
        const count = await knex(this.tableName).where({ id }).del();
        return count > 0;
    }

    async exists(id: number): Promise<boolean> {
        const result = await knex(this.tableName)
            .where({ id })
            .count('* as count')
            .first();

        return Number(result?.count) > 0;
    }
}
