import { format, parseISO } from 'date-fns';

export class Patient {
    private _id?: number;
    private _name: string;
    private _birthDate: Date;
    private _cpf: string;
    private _gender: string;
    private _addressLine?: string;
    private _addressNumber?: string;
    private _district?: string;
    private _city?: string;
    private _state?: string;
    private _zipCode?: string;
    private _active?: boolean;

    constructor(data: Partial<Patient>) {
        this._id = data.id;
        this._name = data.name || '';
        this._birthDate = data.birthDate ? new Date(data.birthDate) : new Date();
        this._cpf = data.cpf || '';
        this._gender = data.gender || '';
        this._addressLine = data.addressLine || '';
        this._addressNumber = data.addressNumber || '';
        this._district = data.district || '';
        this._city = data.city || '';
        this._state = data.state || '';
        this._zipCode = data.zipCode || '';
        this._active = data.active !== undefined ? data.active : true;
    }

    get id(): number | undefined {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get birthDate(): Date {
        return this._birthDate;
    }

    get formattedBirthDate(): string {
        return format(this._birthDate, 'yyyy-MM-dd');
    }

    get cpf(): string {
        return this._cpf;
    }

    get gender(): string {
        return this._gender;
    }


    get addressLine(): string {
        return this._addressLine || '';
    }

    get addressNumber(): string {
        return this._addressNumber || '';
    }

    get district(): string {
        return this._district || '';
    }

    get city(): string {
        return this._city || '';
    }

    get state(): string {
        return this._state || '';
    }

    get zipCode(): string {
        return this._zipCode || '';
    }

    get active(): boolean {
        return this._active || true;
    }

    set name(name: string) {
        if (!name || name.trim().length === 0) {
            throw new Error('O nome é obrigatório');
        }
        this._name = name.trim();
    }

    set birthDate(date: Date | string) {
        const newDate = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(newDate.getTime()) || newDate > new Date()) {
            throw new Error('Data de nascimento inválida');
        }
        this._birthDate = newDate;
    }
    set cpf(cpf: string) {
        const cleanCPF = cpf.replace(/\D/g, '');
        if (cleanCPF.length !== 11) {
            throw new Error('CPF deve conter 11 dígitos');
        }
        this._cpf = cleanCPF;
    }
    set gender(gender: string) {
        if (!gender || gender.trim().length) {
            throw new Error('O gênero é obrigatório');
        }
        this._gender = gender.trim();
    }
    set addressLine(addressLine: string) {
        if (!addressLine || addressLine.trim().length) {
            throw new Error('O endereço é obrigatório');
        }
        this._addressLine = addressLine.trim();
    }
    set addressNumber(addressNumber: string) {
        if (!addressNumber || addressNumber.trim().length) {
            throw new Error('O número do endereço é obrigatório');
        }
        this._addressNumber = addressNumber.trim();
    }
    set district(district: string) {
        if (!district || district.trim().length) {
            throw new Error('O bairro é obrigatório');
        }
        this._district = district.trim();
    }
    set city(city: string) {
        if (!city || city.trim().length === 0) {
            throw new Error('A cidade é obrigatória');
        }
        this._city = city.trim();
    }
    set state(state: string) {
        if (!state || state.trim().length !== 2) {
            throw new Error('O estado deve conter 2 caracteres');
        }
        this._state = state.trim().toUpperCase();
    }
    set zipCode(zipCode: string) {
        const cleanZipCode = zipCode.replace(/\D/g, '');
        if (cleanZipCode.length !== 8) {
            throw new Error('CEP deve conter 8 dígitos');
        }
        this._zipCode = cleanZipCode;
    }

    toggleStatus(): boolean {
        this._active = !this._active;
        return this._active;
    }
}
