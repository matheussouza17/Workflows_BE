import { Request } from 'express';

declare global {
    namespace Express {
        export interface Request {
            user_id: string;
            file?: {
                buffer: Buffer;
            };
        }
    }
}
