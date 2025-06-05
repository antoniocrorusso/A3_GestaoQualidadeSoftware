import { BaseRepository } from './BaseRepository';
import { User } from '../entities/user';
import knex from '../services/bdConnection';
import { IUserRepository } from '../interfaces/IUserRepository';

export class UserRepository extends BaseRepository<User> implements IUserRepository {
    constructor() {
        super('users');
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await knex(this.tableName).where({ email }).first();
        return user ? new User(user) : null;
    }

    async create(userData: Omit<User, 'id'>): Promise<User> {
        const userToInsert = {
            name: userData.name,
            email: userData.email,
            password: userData.password
        };

        const [created] = await knex(this.tableName)
            .insert(userToInsert)
            .returning('*');

        return new User({
            id: created.id,
            name: created.name,
            email: created.email,
            password: "********"
        });
    }

    async findById(id: number): Promise<User | null> {
        const user = await knex(this.tableName).where({ id }).first();
        return user ? new User(user) : null;
    }
}
