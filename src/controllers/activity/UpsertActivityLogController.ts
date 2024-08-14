import { Response, Request } from "express";
import { UpsertActivityLogService } from '../../services/activity/UpsertActivityLogService';
import { verify } from 'jsonwebtoken';

class UpsertActivityLogController {
    async handle(req: Request, res: Response) {
        const { id, processId, action, description } = req.body;
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "Token is missing!" });
        }

        const [, token] = authHeader.split(' ');

        try {
            const decodedToken = verify(token, process.env.JWT_SECRET as string);
            const { sub: userId } = decodedToken as { sub: string };

            const upsertActivityLogService = new UpsertActivityLogService();

            const activityLog = await upsertActivityLogService.execute({
                id,
                processId,
                action,
                userId: parseInt(userId), // convertendo para número, se necessário
                description
            });

            return res.json(activityLog);

        } catch (error) {
            return res.status(401).json({ error: "Invalid token!" });
        }
    }
}

export { UpsertActivityLogController };
