import { User } from "@/entities/user";

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    create(userData: Omit<User, 'id'>): Promise<User>;
    findById(id: number): Promise<User | null>;
}