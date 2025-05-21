export interface Patient {
    id?: number;
    name: string;
    birth_date: string;
    cpf: string;
    gender: string;
    address_line: string;
    address_number: string;
    district: string;
    city: string;
    state: string;
    zip_code: string;
    is_active?: boolean;
}
