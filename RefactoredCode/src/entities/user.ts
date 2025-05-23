export class User {
    private _id?: number;
    private _name: string;
    private _email: string;
    private _password: string;

    constructor(data: Partial<User>) {
        this._id = data.id;
        this._name = data.name || '';
        this._email = data.email || '';
        this._password = data.password || '';
    }

    get id(): number | undefined {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get password(): string {
        return this._password;
    }

    set name(name: string) {
        if (!name || name.trim().length) {
            throw new Error('O nome é obrigatório');
        }
        this._name = name.trim();
    }

    set email(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            throw new Error('E-mail inválido');
        }
        this._email = email.trim().toLowerCase();
    }

    async setPassword(password: string): Promise<void> {
        if (!password || password.length < 8) {
            throw new Error('A senha deve ter no mínimo 8 caracteres');
        }
        this._password = password;
    }

    async validatePassword(password: string): Promise<boolean> {
        return password === this._password;
    }
}
