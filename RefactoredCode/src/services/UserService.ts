import { User } from '../entities/user';
import { UserRepository } from '../repositories/UserRepository';

export class UserService {
    constructor(private repository: UserRepository) { }

    async createUser(userData: Omit<User, 'id'>): Promise<User> {
        try {
            const existingEmail = await this.repository.findByEmail(userData.email);
            if (existingEmail) {
                throw new Error('Já existe um usuário com este e-mail cadastrado.');
            }

            await userData.setPassword(userData.password);
            const user = new User(userData);
            return await this.repository.create(user);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro ao criar usuário.');
        }
    }

    async loginUser(email: string, password: string): Promise<User | null> {
        try {
            const user = await this.repository.findByEmail(email);
            if (!user) {
                return null;
            }

            if (!await user.validatePassword(password)) {
                return null;
            }

            return user;
        } catch (error) {
            throw new Error('Erro ao autenticar usuário.');
        }
    }
}
