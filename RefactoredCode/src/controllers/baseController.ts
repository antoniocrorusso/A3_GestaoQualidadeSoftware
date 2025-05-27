import { Request, Response } from 'express';

export abstract class BaseController {
    protected constructor() { }

    protected async handleRequest(
        req: Request,
        res: Response,
        operation: () => Promise<void>
    ): Promise<void> {
        try {
            await operation();
        } catch (error) {
            res.status(500).json('Erro interno do servidor.');
        }
    }
}