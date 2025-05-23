import express, { Router } from 'express';
import { userController } from './controllers/users';
import { patientController } from './controllers/patients';
import { validateUserData } from './middlewares/users';
import { validatePatientExists } from './middlewares/patients';
import { registerUserSchema, loginUserSchema } from './schemas/users';
import { registerPatientSchema, editPatientSchema } from './schemas/patients';
import { authentication } from './middlewares/auth';

const routes = express.Router();

routes.get('/', (req, res) => {
    return res.status(200).json({ message: "Servidor ativo" });
});

// Rotas públicas
routes.post('/user/register', validateUserData(registerUserSchema), (req, res) => userController.registerUser(req, res));
routes.post('/user/login', validateUserData(loginUserSchema), (req, res) => userController.loginUser(req, res));

// Middleware de autenticação para rotas protegidas
routes.use(authentication);

// Rotas de pacientes
routes.get('/patients/list', (req, res) => patientController.listPatients(req, res));
routes.post('/patients/register', validateUserData(registerPatientSchema), (req, res) => patientController.registerPatient(req, res));
routes.put('/patients/:id/edit', validatePatientExists, validateUserData(editPatientSchema), (req, res) => patientController.editPatient(req, res));
routes.delete('/patient/:id/delete', validatePatientExists, (req, res) => patientController.inactivatePatient(req, res));
routes.put('/patient/:id/activate', validatePatientExists, (req, res) => patientController.activatePatient(req, res));

export default routes;
