import { PatientRepository } from "../../src/repositories/PatientRepository";
import { Patient } from "../../src/entities/patient";
import knex from "../../src/services/bdConnection";


//As with the other repository classe that uses Databases functions, we need to mock those to propperly test our repositories methods.
//This is because we"re not testing, for instance, if WHERE is working, but rather our method logic. 
jest.mock("../../src/services/bdConnection");
const mockedKnex = knex as unknown as jest.Mock;

describe("PatientRepository", () => {
  let patientRepository: PatientRepository;

  beforeEach(() => {
    patientRepository = new PatientRepository();
    mockedKnex.mockClear();
  });

  test("test method: findByCpf - Completes successfullt and returns a patient", async () => {
    const patientData = {
      id: 1,
      name: "Alice Silva",
      cpf: "74292807060",
      birth_date: "1990-01-01",
      gender: "F",
      address_line: "Rua A",
      address_number: "123",
      district: "Centro",
      city: "São Paulo",
      state: "SP",
      zip_code: "12345678",
      active: true
    };

    const mockWhere = jest.fn().mockReturnValue({first: jest.fn().mockResolvedValue(patientData)});
    mockedKnex.mockReturnValue({ where: mockWhere });
    const res = await patientRepository.findByCpf("74292807060");

    //Expected answers
    expect(res).toBeInstanceOf(Patient);
    expect(res?.cpf).toBe("74292807060");
  });

  test("test method: toggleStatus - Updates patient active status correctly", async () => {
    const mockUpdate = jest.fn().mockResolvedValue(1);
    const mockWhere = jest.fn().mockReturnValue({ update: mockUpdate });
    mockedKnex.mockReturnValue({ where: mockWhere });
    const res = await patientRepository.toggleStatus(1, false);

    //Expected answers
    expect(res).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith({ active: false });
  });

  test("test method: createPatient - Correctly inserts patient and returns instance", async () => {
    const patientData = new Patient({
      name: "Bob Construtor",
      cpf: "74292807060",
      gender: "M",
      birthDate: new Date("1990-02-01"),
      addressLine: "Rua B",
      addressNumber: "456",
      district: "Bairro",
      city: "Rio",
      state: "RJ",
      zipCode: "87654321",
      active: true,
    });

    const inserted = {
      id: 1,
      name: "Bob Construtor",
      cpf: "74292807060",
      gender: "M",
      birth_date: new Date("1990-02-01"),
      address_line: "Rua B",
      address_number: "456",
      district: "Bairro",
      city: "Rio",
      state: "RJ",
      zip_code: "87654321",
      active: true,
    };
    mockedKnex.mockReturnValue({insert: jest.fn().mockReturnValue({ returning: jest.fn().mockResolvedValue([inserted]) })});
    const res = await patientRepository.create(patientData);

    //Expected Answers
    expect(res).toBeInstanceOf(Patient);
    expect(res.name).toBe("Bob Construtor");
  });

  test("test method: update - updates the patient file and returns correctly", async () => {
    const patientData = {
      name: "Alice Atualizada",
      cpf: "74292807000",
      birth_date: new Date("1990-10-01"),
      gender: "F",
      address_line: "Rua A",
      address_number: "1234",
      district: "Centro",
      city: "São Paulo",
      state: "SP",
      zip_code: "06500000",
      active: true
    };

    const returning = {
      id: 1,
      ...patientData,
      birth_date: patientData.birth_date,
      address_line: patientData.address_line,
      address_number: patientData.address_number,
      zip_code: patientData.zip_code,
    };

    mockedKnex.mockReturnValue({
      where: jest.fn().mockReturnValue({
        update: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([returning]),
        }),
      }),
    });
    const res = await patientRepository.update(1, patientData);

    //Expected Answers
    expect(res).toBeInstanceOf(Patient);
    expect(res.name).toBe("Alice Atualizada");
  });

  test("test method: findById - returns patient if found", async () => {
    const patientData = {
      id: 1,
      name: "Alice Silva",
      cpf: "74292807060",
      birth_date: "1990-01-01",
      gender: "F",
      address_line: "Rua A",
      address_number: "123",
      district: "Centro",
      city: "São Paulo",
      state: "SP",
      zip_code: "12345678",
      active: true
    };

    mockedKnex.mockReturnValue({
      where: jest.fn().mockReturnValue({
        first: jest.fn().mockResolvedValue(patientData)
      })
    });
    const res = await patientRepository.findById(1);

    //Expected Answers
    expect(res).toBeInstanceOf(Patient);
    expect(res?.name).toBe("Alice Silva");
  });  

  test("test method: findAll - Returns all patients in the database", async () => {
    const patients = [
      {
        id: 1,
        name: "Alice Silva",
        cpf: "74292807060",
        birthDate: "1990-01-01",
        gender: "F",
        address_line: "Rua A",
        address_number: "100",
        district: "Centro",
        city: "BH",
        state: "MG",
        zip_code: "06500000",
        active: true,
      },
      {
        id: 2,
        name: "Bob Construtor",
        cpf: "74292807060",
        gender: "M",
        birthDate: new Date("1990-02-01"),
        address_line: "Rua B",
        address_number: "20",
        district: "Bairro",
        city: "SP",
        state: "SP",
        zip_code: "06500000",
        active: false,
      },
    ];

    mockedKnex.mockReturnValue({
      select: jest.fn().mockResolvedValue(patients)
    });

    const res = await patientRepository.findAll();

    //Expected Answer
    expect(res.length).toBe(2);
    expect(res[0]).toBeInstanceOf(Patient);
  });  

  test("test method: delete - returns true when deletion is successful", async () => {
    mockedKnex.mockReturnValue({
      where: jest.fn().mockReturnValue({
        del: jest.fn().mockResolvedValue(1)
      })
    });
    const res = await patientRepository.delete(1);

    //Expected Answer
    expect(res).toBe(true);
  });

  test("test method: exists - returns true if count is greater than 0", async () => {
    mockedKnex.mockReturnValue({
      where: jest.fn().mockReturnValue({
        count: jest.fn().mockReturnValue({
          first: jest.fn().mockResolvedValue({ count: "1" })
        })
      })
    });
    const res = await patientRepository.exists(1);
    
    //Expected Answer
    expect(res).toBe(true);
  });
});