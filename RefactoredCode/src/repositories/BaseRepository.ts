import { IRepository } from '../interfaces/IRepository';
import knex from '../services/bdConnection';

export abstract class BaseRepository<T extends { id?: number }> implements IRepository<T> {
    protected tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    async findAll(): Promise<T[]> {
        return knex(this.tableName).select('*');
    }

    async findById(id: number): Promise<T | null> {
        return knex(this.tableName).where({ id }).first() || null;
    }

    async create(entity: Omit<T, 'id'>): Promise<T> {
        const [created] = await knex(this.tableName).insert(entity).returning('*');
        return created;
    }

    async update(id: number, entity: Partial<T>): Promise<T> {
        const updatedData = await knex(this.tableName).where({ id }).update(entity).returning('*');
        return updatedData[0];
    }

    async delete(id: number): Promise<boolean> {
        const count = await knex(this.tableName).where({ id }).delete();
        return count > 0;
    }

    async exists(id: number): Promise<boolean> {
        const result = await knex(this.tableName).where({ id }).count('* as count').first();
        return Number(result?.count) > 0;
    }
}
