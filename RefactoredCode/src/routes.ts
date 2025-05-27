import { Router } from 'express';
import { patientController } from './controllers/patients';
import { userController } from './controllers/users';
import { editPatientSchema, registerPatientSchema } from './schemas/patients';
import { registerUserSchema, loginUserSchema } from './schemas/users';
import { validatePatientSchema } from './middlewares/patients';
import { validateUserData } from './middlewares/users';
import { authentication } from './middlewares/auth';

export const router = Router();

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

router.post('/users', validateUserData(registerUserSchema), (req, res) => userController.registerUser(req, res));
router.post('/users/login', validateUserData(loginUserSchema), (req, res) => userController.loginUser(req, res));

router.use(authentication);

router.get('/patients', (req, res) => patientController.listPatients(req, res));
router.post('/patients',
    validatePatientSchema(registerPatientSchema),
    (req, res) => patientController.registerPatient(req, res)
);
router.put('/patients/:id',
    validatePatientSchema(editPatientSchema),
    (req, res) => patientController.editPatient(req, res)
);
router.put('/patients/:id/inactivate', (req, res) => patientController.inactivatePatient(req, res));
router.put('/patients/:id/activate', (req, res) => patientController.activatePatient(req, res));

export default router;