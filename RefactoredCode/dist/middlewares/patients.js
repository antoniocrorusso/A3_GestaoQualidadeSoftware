"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePatientExists = void 0;
const bdConnection_1 = __importDefault(require("@/services/bdConnection"));
const validatePatientExists = async (req, res, next) => {
    const { id } = req.params;
    try {
        const patient = await (0, bdConnection_1.default)('patients').where({ id }).first();
        if (!patient) {
            res.status(404).json('Paciente não encontrado.');
            return;
        }
        req.patient = patient;
        next();
    }
    catch (error) {
        res.status(500).json('Erro interno do servidor.');
    }
};
exports.validatePatientExists = validatePatientExists;
