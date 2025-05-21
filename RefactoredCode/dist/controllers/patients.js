"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activatePatient = exports.inactivatePatient = exports.editPatient = exports.registerPatient = exports.listPatients = void 0;
const bdConnection_1 = __importDefault(require("@/services/bdConnection"));
const formatDate_1 = require("@/utils/formatDate");
const listPatients = async (req, res) => {
    try {
        const patientsList = await (0, bdConnection_1.default)('patients');
        res.status(200).json(patientsList);
    }
    catch (error) {
        res.status(500).json('Erro interno do servidor.');
    }
};
exports.listPatients = listPatients;
const registerPatient = async (req, res) => {
    const patientData = req.body;
    const { birth_date: rawDate } = patientData;
    const birth_date = (0, formatDate_1.formatDateToInput)(rawDate);
    try {
        const existingPatient = await (0, bdConnection_1.default)('patients').where({ cpf: patientData.cpf }).first();
        if (existingPatient) {
            res.status(400).json('Paciente com esse CPF já cadastrado.');
            return;
        }
        await (0, bdConnection_1.default)('patients').insert({ ...patientData, birth_date });
        res.status(201).json(`Paciente "${patientData.name}" cadastrado com sucesso.`);
    }
    catch (error) {
        res.status(500).json('Erro interno do servidor.');
    }
};
exports.registerPatient = registerPatient;
const editPatient = async (req, res) => {
    const { id } = req.params;
    const patientData = req.body;
    const { birth_date: rawDate } = patientData;
    const birth_date = (0, formatDate_1.formatDateToInput)(rawDate);
    try {
        const existingPatient = await (0, bdConnection_1.default)('patients').where({ id }).first();
        if (!existingPatient) {
            res.status(404).json('Paciente não encontrado.');
            return;
        }
        const existingCPF = await (0, bdConnection_1.default)('patients').where({ cpf: patientData.cpf }).first();
        if (existingCPF && existingCPF.id !== Number(id)) {
            res.status(400).json('Já existe um paciente com este CPF cadastrado.');
            return;
        }
        await (0, bdConnection_1.default)('patients').update({ ...patientData, birth_date }).where({ id });
        res.status(200).json('Dados do paciente atualizados com sucesso.');
    }
    catch (error) {
        res.status(500).json('Erro interno do servidor.');
    }
};
exports.editPatient = editPatient;
const inactivatePatient = async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await (0, bdConnection_1.default)('patients').where({ id }).first();
        if (!patient) {
            res.status(404).json('Paciente não encontrado.');
            return;
        }
        await (0, bdConnection_1.default)('patients').update({ is_active: false }).where({ id });
        res.status(200).json('Paciente inativado com sucesso.');
    }
    catch (error) {
        res.status(500).json('Erro interno do servidor.');
    }
};
exports.inactivatePatient = inactivatePatient;
const activatePatient = async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await (0, bdConnection_1.default)('patients').where({ id }).first();
        if (!patient) {
            res.status(404).json('Paciente não encontrado.');
            return;
        }
        await (0, bdConnection_1.default)('patients').update({ is_active: true }).where({ id });
        res.status(200).json('Paciente ativado com sucesso.');
    }
    catch (error) {
        res.status(500).json('Erro interno do servidor.');
    }
};
exports.activatePatient = activatePatient;
