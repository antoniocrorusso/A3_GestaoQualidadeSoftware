import Joi from 'joi';

export const registerPatientSchema = Joi.object({
    name: Joi.string().required().trim().pattern(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u).messages({
        'any.required': 'O nome deve ser preenchido.',
        'string.empty': 'O nome deve ser preenchido.',
        'string.pattern.base': 'Formato de nome inválido.'
    }),
    birth_date: Joi.date().max('now').iso().required().messages({
        'any.required': 'A data de nascimento deve ser preenchida.',
        'date.max': 'A data de nascimento não deve ser posterior ao dia de hoje.',
        'date.iso': 'Formato de data inválido.'
    }),
    gender: Joi.string().required().trim().messages({
        'any.required': 'O gênero deve ser informado.',
        'string.empty': 'O gênero deve ser informado.'
    }),
    cpf: Joi.string().length(11).pattern(/^\d+$/).trim().required().messages({
        'any.required': 'O CPF deve ser informado.',
        'string.empty': 'O CPF deve ser informado.',
        'string.length': 'O CPF deve conter 11 dígitos',
    }),
    zip_code: Joi.string().length(8).optional().empty('').messages({
        'string.length': 'O CEP deve conter 8 dígitos.'
    }),
    address_number: Joi.number().optional().empty('').messages({
        'number.base': 'O número deve ser informado.'
    }),
    address_line: Joi.string().required().optional().empty('').trim().messages({
        'any.required': 'A rua deve ser informada.',
        'string.empty': 'A rua deve ser informada.'
    }),
    district: Joi.string().optional().empty('').trim().messages({
        'any.required': 'O bairro deve ser informado.'
    }),
    city: Joi.string().optional().empty('').trim().messages({
        'any.required': 'A cidade deve ser informada.'
    }),
    state: Joi.string().length(2).optional().empty('').trim().messages({
        'string.length': 'O estado deve possuir 2 caracteres.'
    }),
});

export const editPatientSchema = Joi.object({
    name: Joi.string().required().trim().pattern(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u).optional().empty().messages({
        'any.required': 'O nome deve ser preenchido.',
        'string.empty': 'O nome deve ser preenchido.',
        'string.pattern.base': 'Formato de nome inválido.'
    }),
    birth_date: Joi.date().required().iso().max('now').optional().empty().messages({
        'any.required': 'A data de nascimento deve ser preenchida.',
        'date.max': 'A data de nascimento não deve ser maior do que hoje.',
        'date.iso': 'Formato de data inválido.'
    }),
    cpf: Joi.string().length(11).pattern(/^\d+$/).optional().empty().trim().required().messages({
        'any.required': 'O CPF deve ser informado.',
        'string.empty': 'O CPF deve ser informado.'
    }),
    gender: Joi.string().required().optional().empty().trim().messages({
        'any.required': 'O gênero deve ser informado.',
        'string.empty': 'O gênero deve ser informado.'
    }),
    zip_code: Joi.string().length(8).optional().empty('').messages({
        'string.length': 'O CEP deve conter 8 dígitos.'
    }),
    address_number: Joi.number().optional().empty('').messages({
        'number.base': 'O número deve ser informado.'
    }),
    address_line: Joi.string().required().optional().empty('').trim().messages({
        'any.required': 'A rua deve ser informada.',
        'string.empty': 'A rua deve ser informada.'
    }),
    district: Joi.string().optional().empty('').trim().messages({
        'any.required': 'O bairro deve ser informado.'
    }),
    city: Joi.string().optional().empty('').trim().messages({
        'any.required': 'A cidade deve ser informada.'
    }),
    state: Joi.string().length(2).optional().empty('').trim().messages({
        'string.length': 'O estado deve possuir 2 caracteres.'
    }),
});
