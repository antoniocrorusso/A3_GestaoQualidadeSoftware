"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPatientSchema = exports.registerPatientSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerPatientSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    birth_date: joi_1.default.string().required(),
    cpf: joi_1.default.string().required(),
    gender: joi_1.default.string().required(),
    address_line: joi_1.default.string().required(),
    address_number: joi_1.default.string().required(),
    district: joi_1.default.string().required(),
    city: joi_1.default.string().required(),
    state: joi_1.default.string().required(),
    zip_code: joi_1.default.string().required()
});
exports.editPatientSchema = joi_1.default.object({
    name: joi_1.default.string(),
    birth_date: joi_1.default.string(),
    cpf: joi_1.default.string(),
    gender: joi_1.default.string(),
    address_line: joi_1.default.string(),
    address_number: joi_1.default.string(),
    district: joi_1.default.string(),
    city: joi_1.default.string(),
    state: joi_1.default.string(),
    zip_code: joi_1.default.string()
});
