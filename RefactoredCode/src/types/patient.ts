export interface Patient {
    id?: number;
    name: string;
    birth_date: string;
    gender: string;
    cpf: string;
    zip_code?: string;
    address_line?: string;
    district?: string;
    address_number?: string;
    city?: string;
    state?: string;
    active: boolean;
}
