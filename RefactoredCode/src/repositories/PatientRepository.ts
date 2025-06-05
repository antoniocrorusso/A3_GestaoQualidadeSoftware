import { BaseRepository } from './BaseRepository';
import { Patient } from '../entities/patient';
import knex from '../services/bdConnection';
import { IPatientRepository } from '../interfaces/IPatientRepository';

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
        const patientToInsert = {
            name: patientData.name,
            birth_date: patientData.birthDate,
            cpf: patientData.cpf,
            gender: patientData.gender,
            address_line: patientData.addressLine,
            address_number: patientData.addressNumber,
            district: patientData.district,
            city: patientData.city,
            state: patientData.state,
            zip_code: patientData.zipCode,
            active: patientData.active
        };

        const [created] = await knex(this.tableName).insert(patientToInsert).returning('*');
        return new Patient(created);
    }

    async update(id: number, patientData: Partial<Patient>): Promise<Patient> {
        const patientToInsert = {
            name: patientData.name,
            birth_date: patientData.birthDate,
            cpf: patientData.cpf,
            gender: patientData.gender,
            address_line: patientData.addressLine,
            address_number: patientData.addressNumber,
            district: patientData.district,
            city: patientData.city,
            state: patientData.state,
            zip_code: patientData.zipCode,
            active: patientData.active
        };
        const updatedPacient = await knex(this.tableName).where({ id }).update(patientToInsert).returning('*');
        return new Patient(updatedPacient[0]);
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
