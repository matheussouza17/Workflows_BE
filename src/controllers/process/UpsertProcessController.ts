import { Response, Request } from "express";
import { UpsertProcessService } from '../../services/process/UpsertProcessService';
import { verify } from 'jsonwebtoken';

class UpsertProcessController {
    async handle(req: Request, res: Response) {
        const { approvalId, departmentFromId, departmentToId, roleFrom, roleTo, userToId, comment, action, status } = req.body;
        const authHeader = req.headers.authorization;
        const { id } = req.params; 

        if (!authHeader) {
            return res.status(401).json({ error: "Token is missing!" });
        }

        const [, token] = authHeader.split(' ');

        try {
            const decodedToken = verify(token, process.env.JWT_SECRET as string);
            const { sub: userId } = decodedToken as { sub: string };

            const upsertProcessService = new UpsertProcessService();
            
            const processData = await upsertProcessService.execute({
                id: Number(id),
                approvalId,
                departmentFromId,
                departmentToId,
                roleFrom,
                roleTo,
                executedById: parseInt(userId), // convertendo para número, se necessário
                userToId,
                comment,
                action,
                status
            });

            return res.json(processData);

        } catch (error) {
            return res.status(401).json({ error: "Invalid token!" });
        }
    }
}

export { UpsertProcessController };
