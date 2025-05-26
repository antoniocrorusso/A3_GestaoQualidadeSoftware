import { patientController } from '../src/controllers/patients' 
import knex from '../src/services/bdConnection';
import * as formatDate from '../src/utils/formatDate';

//OBS: To test database methods, request and response on the controllers classes, we decided to mock those using jest.

jest.mock('../src/utils/formatDate', () => ({
  __esModule: true,
  formatDateToInput: jest.fn((d: string) => d)   // just echoes the input
}));

jest.mock('../src/services/bdConnection', () => {
  const builder = {
    where : jest.fn().mockReturnThis(),
    first : jest.fn(),
    insert: jest.fn(),
    update: jest.fn().mockReturnThis()
  };

  const knex = jest.fn(() => builder);
  Object.assign(knex, builder);

  return { __esModule: true, default: knex };
});

jest.spyOn(console, 'error').mockImplementation(() => {});

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('PatientController', () => {
  afterEach(() => jest.clearAllMocks());

  test('case method: registerPatient - completed successfully', async () => {
    const req = {
      body: {
        name: 'Alice Silva',
        cpf: '74292807060',
        birth_date: '1990-01-01',
        email: 'alice@email.com',
      }
    };

    const res = mockRes();
    (knex.first as jest.Mock).mockResolvedValueOnce(undefined); // Simulate there was no duplicates 

    await patientController.registerPatient(req as any, res as any);

    expect(knex.insert).toHaveBeenCalledWith(expect.objectContaining({ name: 'Alice Silva' }));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.stringContaining('cadastrado com sucesso')); // Expected answer. 
  });

    test('case method: registerPatient - Not completed. Patient already in Database', async () => {
    const req = {
      body: {
        name: 'Bob Construtor',
        cpf: '74292807060',
        birth_date: '1990-02-01',
        email: 'bob@construtor.com',
      }
    };

    const res = mockRes();
    (knex.first as jest.Mock).mockResolvedValueOnce({ id: 1 }); // Patient already in DB 

    await patientController.registerPatient(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(expect.stringContaining('Já existe um paciente com este CPF cadastrado')); // Expected answer. 
  });

  test('case method: editPatient - Completed successfully', async () => {
    const req = {
      params: { id: '1' },
      body: {
        name: 'Novo nome',
        cpf: '39133787077',
        birth_date: '1980-05-05',
        email: 'novo@nome.com',
      }
    };
    const res = mockRes();

    (knex.first as jest.Mock)
      .mockResolvedValueOnce({ id: 1 }) // Patient already exists
      .mockResolvedValueOnce(undefined); // No CPF conflict

    await patientController.editPatient(req as any, res as any);

    expect(knex.update).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Novo nome',
      cpf: '39133787077'
    }));
    expect(res.status).toHaveBeenCalledWith(200); // Expected answer. 
  });

  test('case method: editPatient - No patient found', async () => {
    const req = {
      params: { id: '2' },
      body: {
        name: 'Sem paciente',
        cpf: '39133787077',
        birth_date: '1980-05-05',
        email: 'sempaciente@np.com',
      }
    };
    const res = mockRes();

    (knex.first as jest.Mock).mockResolvedValueOnce(undefined); // No patient found

    await patientController.editPatient(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.stringContaining('Paciente não encontrado')); // Expected answer. 
  });

    test('case method: editPatient - CPF already used by another patient', async () => {
    const req = {
      params: { id: '3' },
      body: {
        name: 'Conflito',
        cpf: '39133787077',
        birth_date: '1985-05-11',
        email: 'conflito@cpf.com',
      }
    };
    const res = mockRes();

    (knex.first as jest.Mock)
      .mockResolvedValueOnce({ id: 3 })         // Found the patient
      .mockResolvedValueOnce({ id: 99 });       // Fount other with the same CPF

    await patientController.editPatient(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(expect.stringContaining('Já existe um paciente com este CPF cadastrado')); // Expected answer. 
  });


  test('inactivatePatient - sets active=false', async () => {
    const req = { params: { id: '4' } };
    const res = mockRes();
    (knex.first as jest.Mock).mockResolvedValueOnce({ id: 4 });

    await patientController.inactivatePatient(req as any, res as any);

    expect(knex.update).toHaveBeenCalledWith({ active: false });
    expect(res.status).toHaveBeenCalledWith(200); // Expected answer.
  });

  test('activatePatient - sets active=true', async () => {
    const req = { params: { id: '5' } };
    const res = mockRes();
    (knex.first as jest.Mock).mockResolvedValueOnce({ id: 5 });

    await patientController.activatePatient(req as any, res as any);

    expect(knex.update).toHaveBeenCalledWith({ active: true });
    expect(res.status).toHaveBeenCalledWith(200); // Expected answer. 
  });
});