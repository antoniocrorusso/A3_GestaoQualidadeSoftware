import { PatientRepository } from './repositories/PatientRepository';
import { PatientService } from './services/PatientService';
import { PatientController } from './controllers/patients';

export class Container {
    private static instance: Container;
    private services: Map<string, any> = new Map();

    private constructor() {
        this.initializeServices();
    }

    public static getInstance(): Container {
        if (!Container.instance) {
            Container.instance = new Container();
        }
        return Container.instance;
    }

    private initializeServices(): void {
        this.services.set('patientRepository', new PatientRepository());
        this.services.set('patientService', new PatientService(
            this.get('patientRepository')
        ));
        this.services.set('patientController', new PatientController(
            this.get('patientService')
        ));
    }

    public get<T>(key: string): T {
        const service = this.services.get(key);
        if (!service) {
            throw new Error(`Service ${key} not found in container`);
        }
        return service as T;
    }
}

export const container = Container.getInstance();
