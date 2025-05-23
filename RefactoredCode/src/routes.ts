import { Router } from 'express';
import { patientController } from './controllers/patients';
import { editPatientSchema, registerPatientSchema } from './schemas/patients';
import { validatePatientSchema } from './middlewares/patients';

export const router = Router();

// TODO: Remover logs de teste ao fim do desenvolvimento
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

router.get('/patients', (req, res) => patientController.listPatients(req, res));
router.post('/patients',
    validatePatientSchema(registerPatientSchema),
    (req, res) => patientController.registerPatient(req, res)
);
router.put('/patients/:id',
    validatePatientSchema(editPatientSchema),
    (req, res) => patientController.editPatient(req, res)
);
router.patch('/patients/:id/inactivate', (req, res) => patientController.inactivatePatient(req, res));
router.patch('/patients/:id/activate', (req, res) => patientController.activatePatient(req, res));

export default router;