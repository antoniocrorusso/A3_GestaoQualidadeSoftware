"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserData = void 0;
const validateUserData = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body);
        next();
    }
    catch (error) {
        const joiError = error;
        res.status(400).json(joiError.details[0].message);
    }
};
exports.validateUserData = validateUserData;
