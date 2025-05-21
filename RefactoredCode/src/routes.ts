import express, { Router } from 'express';
import { registerUser, loginUser } from '@/controllers/users';
import { registerPatient, listPatients, editPatient, inactivatePatient, activatePatient } from '@/controllers/patients';
import { validateUserData } from '@/middlewares/users';
import { validatePatientExists } from '@/middlewares/patients';
import { registerUserSchema, loginUserSchema } from '@/schemas/users';
import { registerPatientSchema, editPatientSchema } from '@/schemas/patients';
import { authentication } from '@/middlewares/auth';

const routes = express.Router();

routes.get('/', (req, res) => {
    return res.status(200).json({ message: "Servidor ativo" });
});

routes.post('/user/register', validateUserData(registerUserSchema), registerUser);
routes.post('/user/login', validateUserData(loginUserSchema), loginUser);

routes.use(authentication);

routes.get('/patients/list', listPatients);
routes.post('/patients/register', validateUserData(registerPatientSchema), registerPatient);
routes.put('/patients/:id/edit', validatePatientExists, validateUserData(editPatientSchema), editPatient);
routes.delete('/patient/:id/delete', validatePatientExists, inactivatePatient);
routes.put('/patient/:id/activate', validatePatientExists, activatePatient);

export default routes;
