import { PatientService } from "../../src/services/PatientService";
import { Patient } from "../../src/entities/patient";

// We mock a new Service Instance before each test to ensure there's no carryover cached erros, that could impact the next one and cause errors.
// We also mock the Repository, only mirroing it's methods, because we're not testing their methods, but the service ones.

describe("PatientService", () => {
  let service: PatientService;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCpf: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      toggleStatus: jest.fn(),
    };
    service = new PatientService(mockRepository);
  });

  afterEach(() => jest.clearAllMocks());

  //Test cases
  test("case method: getAllPatients - return all patients", async () => {
    const patients = [
      new Patient({
        name: "Alice Silva",
        cpf: "74292807060",
        gender: "F",
        birthDate: new Date("1990-01-01"),
      }),
      new Patient({
        name: "Bob Construtor",
        cpf: "74292807060",
        gender: "M",
        birthDate: new Date("1990-02-01"),
      }),
    ];
    mockRepository.findAll.mockResolvedValue(patients);
    const res = await service.getAllPatients();

    //Expected Answers
    expect(res).toEqual(patients);
  });

  test("case method: getAllPatients - throws error on failure", async () => {
    mockRepository.findAll.mockRejectedValue(new Error("DB error"));

    //Expected Answers
    await expect(service.getAllPatients()).rejects.toThrow(
      "Erro ao buscar pacientes."
    );
  });

  test("case method: getPatientById - Found the patient and return it", async () => {
    const patient = new Patient({
      id: 1,
      name: "João Silva",
      cpf: "74292807060",
      gender: "M",
      birthDate: new Date("1995-02-11"),
    });
    mockRepository.findById.mockResolvedValue(patient);
    const res = await service.getPatientById(1);

    //Expected Answers
    expect(res).toEqual(patient);
  });

  test("case method: getPatientById - Service error: Failed to search for patient", async () => {
    mockRepository.findById.mockRejectedValue(new Error("fail"));

    //Expected Answers
    await expect(service.getPatientById(1)).rejects.toThrow(
      "Erro ao buscar paciente."
    );
  });

  test("case method: createPatient - Completed Successfully", async () => {
    const patientData = {
      name: "João Silva",
      cpf: "74292807060",
      gender: "M",
      birthDate: new Date("1995-02-11"),
    };
    mockRepository.findByCpf.mockResolvedValue(null);
    const createdPatient = new Patient(patientData);
    mockRepository.create.mockResolvedValue(createdPatient);
    const res = await service.createPatient(createdPatient);

    //Expected Answers
    expect(res).toEqual(createdPatient);
  });

  test("case method: createPatient - Service error: patient CPF already exists", async () => {
    const patientData = {
      name: "Ana Silva",
      cpf: "74292807060",
      gender: "F",
      birthDate: new Date("1995-02-11"),
    };
    mockRepository.findByCpf.mockResolvedValue(new Patient(patientData));

    //Expected Answers
    await expect(
      service.createPatient(new Patient(patientData))
    ).rejects.toThrow("Já existe um paciente com este CPF cadastrado.");
  });

  test("case method: getPatientById - Service error: Generic error", async () => {
    const patientData = {
      name: "Mateus Error",
      cpf: "742921804060",
      gender: "M",
      birthDate: new Date("1975-12-10"),
    };
    mockRepository.findByCpf.mockResolvedValue(null);
    mockRepository.create.mockRejectedValue("fail");

    //Expected Answers
    await expect(
      service.createPatient(new Patient(patientData))
    ).rejects.toThrow("Erro ao criar paciente.");
  });

  test("case method: updatePatient - Completed successfully", async () => {
    const id = 2;
    const patientData = new Patient({
      id,
      name: "Carlos Atualizado",
      cpf: "12345678900",
      gender: "M",
      birthDate: new Date("1980-05-11"),
    });
    mockRepository.findById.mockResolvedValue(patientData);
    mockRepository.findByCpf.mockResolvedValue(null);
    mockRepository.update.mockResolvedValue(patientData);
    const res = await service.updatePatient(id, patientData);

    //Expected Answers
    expect(res).toEqual(patientData);
  });

  test("case method: updatePatient - Service error: invalid ID", async () => {
    const patientData = new Patient({
      name: "Carlos Atualizado",
      cpf: "12345678900",
      gender: "M",
      birthDate: new Date("1980-05-11"),
    });

    //Expected Answers
    await expect(service.updatePatient(NaN, patientData)).rejects.toThrow(
      "ID do paciente inválido."
    );
  });

  test("case method: updatePatient - Service error: patient not found", async () => {
    const patientData = new Patient({
      name: "Carlos Atualizado",
      cpf: "12345678900",
      gender: "M",
      birthDate: new Date("1980-05-11"),
    });
    mockRepository.findById.mockResolvedValue(null);

    //Expected Answers
    await expect(service.updatePatient(3, patientData)).rejects.toThrow(
      "Paciente não encontrado."
    );
  });

  test("case method: updatePatient - Service error: CPF belongs to another patient", async () => {
    const patientData = new Patient({
      id: 4,
      name: "Carlos Atualizado",
      cpf: "12345678900",
      gender: "M",
      birthDate: new Date("1980-05-11"),
    });
    mockRepository.findById.mockResolvedValue(patientData);
    mockRepository.findByCpf.mockResolvedValue(patientData);

    //Expected Answers
    await expect(service.updatePatient(5, patientData)).rejects.toThrow(
      "Já existe um paciente com este CPF cadastrado."
    );
  });

  test("case method: updatePatient - Service error: Generic error", async () => {
    const patientData = new Patient({
      id: 6,
      name: "Carlos",
      cpf: "12345678900",
      gender: "M",
      birthDate: new Date("1980-05-11"),
    });
    mockRepository.findById.mockResolvedValue(patientData);
    mockRepository.findByCpf.mockResolvedValue(null);
    mockRepository.update.mockResolvedValue(null);

    //Expected Answers
    await expect(service.updatePatient(6, patientData)).rejects.toThrow(
      "Falha ao atualizar o paciente."
    );
  });

  test("case method: togglePatientStatus - Completed successfully", async () => {
    mockRepository.findById.mockResolvedValue(new Patient({ id: 7 }));
    mockRepository.toggleStatus.mockResolvedValue(true);
    const res = await service.togglePatientStatus(1, false);

    //Expected Answers
    expect(res).toBe(true);
  });

  test("case method: togglePatientStatus - Service error: Invalid ID", async () => {
    //Expected Answers
    await expect(service.togglePatientStatus(NaN, false)).rejects.toThrow(
      "ID do paciente inválido."
    );
  });

  test("case method: togglePatientStatus - Service error: Patient not found", async () => {
    mockRepository.findById.mockResolvedValue(null);

    //Expected Answers
    await expect(service.togglePatientStatus(8, false)).rejects.toThrow(
      "Paciente não encontrado."
    );
  });

  test("case method: togglePatientStatus - Service error: General toggle error", async () => {
    mockRepository.findById.mockResolvedValue(new Patient({ id: 9 }));
    mockRepository.toggleStatus.mockRejectedValue("fail");

    //Expected Answers
    await expect(service.togglePatientStatus(9, false)).rejects.toThrow(
      "Erro ao alternar status do paciente."
    );
  });
});
