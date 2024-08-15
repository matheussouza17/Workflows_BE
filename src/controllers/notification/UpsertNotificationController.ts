import { Response, Request } from "express";
import { UpsertNotificationService } from '../../services/notification/UpsertNotificationService';


class UpsertNotificationController {
    async handle(req: Request, res: Response) {
        const { userId, message, read } = req.body;
        const authHeader = req.headers.authorization;
        const { id } = req.params; 

        if (!authHeader) {
            return res.status(401).json({ error: "Token is missing!" });
        }

        try {
            const upsertNotificationService = new UpsertNotificationService();

            const notification = await upsertNotificationService.execute({
                id: Number(id),
                userId: parseInt(userId), // convertendo para número, se necessário
                message,
                read
            });

            return res.json(notification);

        } catch (error) {
            return res.status(401).json({ error: "Invalid token!" });
        }
    }
}

export { UpsertNotificationController };
