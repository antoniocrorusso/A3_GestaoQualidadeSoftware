import { PatientController } from "../../src/controllers/patients";
import { Patient } from "../../src/entities/patient";

// We mock a new controller before each test to ensure there's no carryover cached erros, that could impact the next one and cause errors.
// We also mock the PatientService, only mirroing it's methods, because we're not testing their methods, but the controller ones
// as well as the Request/Response.

const mockReqRes = () => {
  const req: any = {};
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  return { req, res };
};

describe("PatientController", () => {
  let mockService: any;
  let patientController: PatientController;

  beforeEach(() => {
    mockService = {
      getAllPatients: jest.fn(),
      getPatientById: jest.fn(),
      createPatient: jest.fn(),
      updatePatient: jest.fn(),
      togglePatientStatus: jest.fn(),
    };

    patientController = new PatientController(mockService);
  });

  afterEach(() => jest.clearAllMocks());

  test("case method: registerPatient - completed successfully", async () => {
    const { req, res } = mockReqRes();
    req.body = {
      name: "Alice Silva",
      cpf: "74292807060",
      birth_date: "1990-01-01",
      email: "alice@email.com",
    };
    mockService.createPatient.mockResolvedValueOnce(
      new Patient({ name: "Alice Silva", cpf: "74292807060" })
    );
    await patientController.registerPatient(req, res);

    // Expected answers
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  test("case method: registerPatient - Not completed. Serivce Error: Patient already in Database", async () => {
    const { req, res } = mockReqRes();
    req.body = {
      name: "Bob Construtor",
      cpf: "74292807060",
      birth_date: "1990-02-01",
      email: "bob@construtor.com",
    };
    mockService.createPatient.mockRejectedValueOnce(
      new Error("Já existe um paciente com este CPF cadastrado.")
    );
    await patientController.registerPatient(req, res);

    // Expected answers
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Já existe um paciente com este CPF cadastrado.",
      })
    );
  });

  test("case method: editPatient - Completed successfully", async () => {
    const { req, res } = mockReqRes();
    req.params = { id: "1" };
    req.body = {
      name: "Novo nome",
      cpf: "39133787077",
      birth_date: "1980-05-05",
      email: "novo@nome.com",
    };

    mockService.updatePatient.mockResolvedValueOnce(
      new Patient({ name: "Novo nome", cpf: "39133787077" })
    );
    await patientController.editPatient(req, res);

    //Expected Answers
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  test("case method: editPatient - Service Error: No patient found", async () => {
    const { req, res } = mockReqRes();
    req.params = { id: "2" };
    req.body = {
      name: "Sem paciente",
      cpf: "39133787077",
      birth_date: "1980-05-05",
      email: "sempaciente@np.com",
    };

    mockService.updatePatient.mockRejectedValueOnce(
      new Error("Paciente não encontrado.")
    );
    await patientController.editPatient(req, res);

    //Expected Answers
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Paciente não encontrado." })
    );
  });

  test("case method: editPatient - Service Error: CPF already used by another patient", async () => {
    const { req, res } = mockReqRes();
    req.params = { id: "3" };
    req.body = {
      name: "Conflito",
      cpf: "39133787077",
      birth_date: "1985-05-11",
      email: "conflito@cpf.com",
    };
    mockService.updatePatient.mockRejectedValueOnce(
      new Error("Já existe um paciente com este CPF cadastrado.")
    );
    await patientController.editPatient(req, res);

    //Expected Answers
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Já existe um paciente com este CPF cadastrado.",
      })
    );
  });

  test("case method: inactivatePatient - Completed Successfully", async () => {
    const { req, res } = mockReqRes();
    req.params = { id: "4" };
    mockService.togglePatientStatus.mockResolvedValueOnce(true);
    await patientController.inactivatePatient(req, res);

    // Expected answers
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Paciente inativado com sucesso." })
    );
  });

  test("case method: inactivatePatient - Service error: Patient not found", async () => {
    const { req, res } = mockReqRes();
    req.params = { id: "5" };
    mockService.togglePatientStatus.mockRejectedValueOnce(
      new Error("Paciente não encontrado.")
    );
    await patientController.inactivatePatient(req, res);

    // Expected answers
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Paciente não encontrado." })
    );
  });

  test("case method: activatePatient - Completed Successfully", async () => {
    const { req, res } = mockReqRes();
    req.params = { id: "6" };
    mockService.togglePatientStatus.mockResolvedValueOnce(true);
    await patientController.activatePatient(req, res);

    //Expected Answers
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Paciente ativado com sucesso." })
    );
  });

  test("case method: getPatientByID - returns patiente data", async () => {
    const { req, res } = mockReqRes();
    req.params = { id: "7" };
    mockService.getPatientById.mockResolvedValueOnce(
      new Patient({ id: 7, name: "Joao com ID" })
    );
    await patientController.getPatientById(req, res);

    //Expected Answers
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Joao com ID" })
    );
  });

  test("case method: getPatientById - Service Error: patient not found", async () => {
    const { req, res } = mockReqRes();
    req.params = { id: "8" };
    mockService.getPatientById.mockResolvedValueOnce(null);
    await patientController.getPatientById(req, res);

    //Expected Answers
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Paciente não encontrado" });
  });

  test("case method: getPatientById - Service Errir: Generic internal error", async () => {
    const { req, res } = mockReqRes();
    req.params = { id: "9" };
    mockService.getPatientById.mockRejectedValueOnce(
      new Error("Erro ao buscar paciente.")
    );
    await patientController.getPatientById(req, res);

    //Expected Answers
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Erro ao buscar paciente." })
    );
  });

  test("case method: listPatients - Completed Successfully", async () => {
    const { req, res } = mockReqRes();
    mockService.getAllPatients.mockResolvedValueOnce([
      new Patient({ id: 10, name: "Joana Dark" }),
      new Patient({ id: 11, name: "Carlos Magno" }),
    ]);
    await patientController.listPatients(req, res);

    //Expected Answers
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: "Joana Dark" }),
        expect.objectContaining({ name: "Carlos Magno" }),
      ])
    );
  });

  test("case method: listPatients - Service Errir: Generic internal error", async () => {
    const { req, res } = mockReqRes();
    mockService.getAllPatients.mockRejectedValueOnce(
      new Error("Erro ao listar pacientes.")
    );
    await patientController.listPatients(req, res);

    //Expected Answers
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Erro ao listar pacientes." })
    );
  });
});
