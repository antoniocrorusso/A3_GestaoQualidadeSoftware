import Joi from 'joi';

export const registerPatientSchema = Joi.object({
    name: Joi.string().required(),
    birth_date: Joi.string().required(),
    cpf: Joi.string().required(),
    gender: Joi.string().required(),
    address_line: Joi.string().required(),
    address_number: Joi.string().required(),
    district: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip_code: Joi.string().required()
});

export const editPatientSchema = Joi.object({
    name: Joi.string(),
    birth_date: Joi.string(),
    cpf: Joi.string(),
    gender: Joi.string(),
    address_line: Joi.string(),
    address_number: Joi.string(),
    district: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zip_code: Joi.string()
});
