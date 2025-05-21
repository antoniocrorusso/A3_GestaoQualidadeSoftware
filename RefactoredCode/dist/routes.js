"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("@/controllers/users");
const patients_1 = require("@/controllers/patients");
const users_2 = require("@/middlewares/users");
const patients_2 = require("@/middlewares/patients");
const users_3 = require("@/schemas/users");
const patients_3 = require("@/schemas/patients");
const auth_1 = require("@/middlewares/auth");
const routes = express_1.default.Router();
routes.get('/', (req, res) => {
    return res.status(200).json({ message: "Servidor ativo" });
});
routes.post('/user/register', (0, users_2.validateUserData)(users_3.registerUserSchema), users_1.registerUser);
routes.post('/user/login', (0, users_2.validateUserData)(users_3.loginUserSchema), users_1.loginUser);
routes.use(auth_1.authentication);
routes.get('/patients/list', patients_1.listPatients);
routes.post('/patients/register', (0, users_2.validateUserData)(patients_3.registerPatientSchema), patients_1.registerPatient);
routes.put('/patients/:id/edit', patients_2.validatePatientExists, (0, users_2.validateUserData)(patients_3.editPatientSchema), patients_1.editPatient);
routes.delete('/patient/:id/delete', patients_2.validatePatientExists, patients_1.inactivatePatient);
routes.put('/patient/:id/activate', patients_2.validatePatientExists, patients_1.activatePatient);
exports.default = routes;
