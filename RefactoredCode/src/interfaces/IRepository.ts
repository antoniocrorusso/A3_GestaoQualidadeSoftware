export interface IRepository<T> {
    findAll(): Promise<T[]>;
    findById(id: number): Promise<T | null>;
    create(entity: Omit<T, 'id'>): Promise<T>;
    update(id: number, entity: Partial<T>): Promise<T>;
    delete(id: number): Promise<boolean>;
    exists(id: number): Promise<boolean>;
}
