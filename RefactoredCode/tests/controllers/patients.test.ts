import { PatientController } from "../../src/controllers/patients";
import { PatientService } from "../../src/services/PatientService";
import { formatDateToInput } from "../../src/utils/formatDate";

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// We mock a new controller and service before each test to ensure there's no carryover cached erros, that could impact the next one and cause errors.
let mockService: any;
let patientController: PatientController;

beforeEach(() => {
  mockService = {
    getAllPatients: jest.fn(),
    createPatient: jest.fn(),
    updatePatient: jest.fn(),
    togglePatientStatus: jest.fn(),
    getPatientById: jest.fn(),
  };

  patientController = new PatientController(mockService);
});

describe("PatientController", () => {
  afterEach(() => jest.clearAllMocks());

  test("case method: registerPatient - completed successfully", async () => {
    const req = {
      body: {
        name: "Alice Silva",
        cpf: "74292807060",
        birth_date: "1990-01-01",
        email: "alice@email.com",
      },
    };
    const res = mockRes();
    mockService.createPatient.mockResolvedValueOnce({ name: "Alice Silva" });
    await patientController.registerPatient(req as any, res as any);

    // Expected answers
    expect(mockService.createPatient).toHaveBeenCalledWith(expect.objectContaining({
      name: "Alice Silva",
      birthDate: formatDateToInput("1990-01-01")
    }));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      message: expect.stringContaining("Alice Silva"),
    }));
  });

  test("case method: registerPatient - Not completed. Patient already in Database", async () => {
    const req = {
      body: {
        name: "Bob Construtor",
        cpf: "74292807060",
        birth_date: "1990-02-01",
        email: "bob@construtor.com",
      },
    };
    const res = mockRes();
    mockService.createPatient.mockRejectedValueOnce(new Error("Já existe um paciente com este CPF cadastrado."));
    await patientController.registerPatient(req as any, res as any);
    
    // Expected answers
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Já existe um paciente com este CPF cadastrado." });
  });

  test("case method: editPatient - Completed successfully", async () => {
    const req = {
      params: { id: "1" },
      body: {
        name: "Novo nome",
        cpf: "39133787077",
        birth_date: "1980-05-05",
        email: "novo@nome.com",
      },
    };
    const res = mockRes();
    mockService.updatePatient.mockResolvedValueOnce({ id: 1, name: "Novo nome" });
    await patientController.editPatient(req as any, res as any);

    //Expected Answers
    expect(mockService.updatePatient).toHaveBeenCalledWith(1, expect.objectContaining({
      name: "Novo nome",
      birthDate: formatDateToInput("1980-05-05")
    }));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      data: expect.objectContaining({ name: "Novo nome" }),
    }));
  });

  test("case method: editPatient - No patient found", async () => {
    const req = {
      params: { id: "2" },
      body: {
        name: "Sem paciente",
        cpf: "39133787077",
        birth_date: "1980-05-05",
        email: "sempaciente@np.com",
      },
    };
    const res = mockRes();
    mockService.updatePatient.mockRejectedValueOnce(new Error("Paciente não encontrado."));
    await patientController.editPatient(req as any, res as any);

    //Expected Answers
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Paciente não encontrado." });
  });

  test("case method: editPatient - CPF already used by another patient", async () => {
    const req = {
      params: { id: "3" },
      body: {
        name: "Conflito",
        cpf: "39133787077",
        birth_date: "1985-05-11",
        email: "conflito@cpf.com",
      },
    };
    const res = mockRes();
    mockService.updatePatient.mockRejectedValueOnce(new Error("Já existe um paciente com este CPF cadastrado."));
    await patientController.editPatient(req as any, res as any);

    //Expected Answers
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Já existe um paciente com este CPF cadastrado." });
  });

  test("case method: inactivatePatient - Completed Successfully", async () => {
    const req = { params: { id: "4" } };
    const res = mockRes();
    mockService.togglePatientStatus.mockResolvedValueOnce(true);
    await patientController.inactivatePatient(req as any, res as any);

    // Expected answers
    expect(mockService.togglePatientStatus).toHaveBeenCalledWith(4, false);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));

  });
  
  test("case method: inactivatePatient - Patient not found", async () => {
    const req = { params: { id: "5" } };
    const res = mockRes();
    mockService.togglePatientStatus.mockRejectedValueOnce(new Error("Paciente não encontrado."));
    await patientController.inactivatePatient(req as any, res as any);

    // Expected answers
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Paciente não encontrado." });
  });
  
  test("case method: activatePatient - Completed Successfully", async () => {
    const req = { params: { id: "6" } };
    const res = mockRes();
    mockService.togglePatientStatus.mockResolvedValueOnce(true);
    await patientController.activatePatient(req as any, res as any);

    //Expected Answers
    expect(mockService.togglePatientStatus).toHaveBeenCalledWith(6, true);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  test("case method: getPatientByID - returns patiente", async () => {
    const req = { params: { id: "7" } };
    const res = mockRes();
    mockService.getPatientById.mockResolvedValueOnce({ id: 7, name: "Joao com ID" });
    await patientController.getPatientById(req as any, res as any);

    //Expected Answers
    expect(mockService.getPatientById).toHaveBeenCalledWith(7);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: "Joao com ID" }));
  });

  test("case method: getPatientById - patient not found", async () => {
    const req = { params: { id: "8" } };
    const res = mockRes();
    mockService.getPatientById.mockResolvedValueOnce(null);
    await patientController.getPatientById(req as any, res as any);

    //Expected Answers
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Paciente não encontrado" });
  });

  test("case method: getPatientById - Service internal error", async () => {
    const req = { params: { id: "9" } };
    const res = mockRes();
    mockService.getPatientById.mockRejectedValueOnce(new Error("Erro ao buscar paciente."));
    await patientController.getPatientById(req as any, res as any);

    //Expected Answers
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao buscar paciente." });
  });
});
