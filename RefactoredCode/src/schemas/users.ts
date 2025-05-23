import Joi from 'joi';

export const registerUserSchema = Joi.object({
    name: Joi.string().required().pattern(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u).messages({
        'any.required': 'O nome deve ser preenchido.',
        'string.empty': 'O nome deve ser preenchido.'
    }),
    email: Joi.string().email().required().messages({
        'any.required': 'O e-mail deve ser preenchido.',
        'string.email': 'Informe um e-mail válido.',
        'string.empty': 'O e-mail deve ser preenchido.'
    }),
    password: Joi.string().min(8).required().messages({
        'any.required': 'A senha deve ser preenchida.',
        'string.empty': 'A senha deve ser preenchida.',
        'string.min': 'A senha deve ter no mínimo 8 caracteres.'
    })
});

export const loginUserSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'any.required': 'O e-mail deve ser preenchido.',
        'string.email': 'O e-mail inválido.',
        'string.empty': 'O e-mail deve ser preenchido.'
    }),
    password: Joi.string().required().min(8).messages({
        'any.required': 'A senha deve ser preenchida.',
        'string.empty': 'A senha deve ser preenchida.',
        'string.min': 'A senha deve ter no mínimo 8 caracteres.'
    })
});
