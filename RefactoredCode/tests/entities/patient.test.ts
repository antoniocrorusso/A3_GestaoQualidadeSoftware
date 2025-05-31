import { Patient } from "../../src/entities/patient";

describe("Patient Entity Tests suites", () => {
  describe("Test Suite 1: Valid Patient ", () => {
    const patient = new Patient({
      id: 1,
      name: "Alice Silva",
      birthDate: new Date(1995, 10, 10),
      cpf: "74292807060",
      gender: "F",
      addressLine: "Rua ABC",
      addressNumber: "123",
      district: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "06500000",
      active: true,
    });

    test("Test case: create a valid patient", () => {
      // Expected Answers
      expect(patient.id).toBe(1);
      expect(patient.name).toBe("Alice Silva");
      expect(patient.formattedBirthDate).toBe("1995-11-10");
      expect(patient.cpf).toBe("74292807060");
      expect(patient.gender).toBe("F");
      expect(patient.addressLine).toBe("Rua ABC");
      expect(patient.addressNumber).toBe("123");
      expect(patient.district).toBe("Centro");
      expect(patient.city).toBe("São Paulo");
      expect(patient.state).toBe("SP");
      expect(patient.zipCode).toBe("06500000");
      expect(patient.active).toBe(true);
    });
  });

  describe("Test Suite 2: Invalid Personal Field Values ", () => {
    const invalidFields = [
      { field: "name", value: "", message: "O nome é obrigatório" },
      { field: "birthDate", value: "3020-01-01", message: "Data de nascimento inválida"},
      { field: "cpf", value: "123", message: "CPF deve conter 11 dígitos" },
      { field: "gender", value: "", message: "O gênero é obrigatório" },
    ];

    for (const testCase of invalidFields) {
      test(`test case: Throw error for invalid ${testCase.field}`, () => {
        const patient = new Patient({});
        // Expected Answers
        expect(() => {(patient as any)[testCase.field] = testCase.value;}).toThrow(testCase.message);
      });
    }
  });

  describe("Test Suite 3: Invalid adresses values ", () => {
    const invalidAdresses = [
      { field: "addressLine", value: "", errorMessage: "O endereço é obrigatório" },
      { field: "addressNumber", value: "", errorMessage: "O número do endereço é obrigatório"},
      { field: "district", value: "", errorMessage: "O bairro é obrigatório" },
      { field: "city", value: "", errorMessage: "A cidade é obrigatória" },
      { field: "state", value: "SPO", errorMessage: "O estado deve conter 2 caracteres"},
      { field: "zipCode", value: "123", errorMessage: "CEP deve conter 8 dígitos" },
    ];

    for (const testCase of invalidAdresses){
        test(`test case: Throw error for invalid ${testCase.field}`, () => {
            const patient = new Patient({});
            
            // Expected Answers
            expect(() => {(patient as any)[testCase.field] = testCase.value;}).toThrow(testCase.errorMessage);
        });
    };
  });

  describe("Test Suite 4: Other verifications", () => {
    test("test case: Trim and format city/state correctly", () => {
      const patient = new Patient({});
      patient.state = " sp ";
      patient.city = "   São Paulo ";

      // Expected Answers
      expect(patient.state).toBe("SP");
      expect(patient.city).toBe("São Paulo");
    });

    test("test method: toggleStatus - Toggle active status correctly", () => {
      const patient = new Patient({ active: true });

      // Expected Answers
      expect(patient.toggleStatus()).toBe(false);
      expect(patient.toggleStatus()).toBe(true);
    });
  });
});