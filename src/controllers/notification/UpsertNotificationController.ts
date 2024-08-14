import { Response, Request } from "express";
import { UpsertNotificationService } from '../../services/notification/UpsertNotificationService';
import { verify } from 'jsonwebtoken';

class UpsertNotificationController {
    async handle(req: Request, res: Response) {
        const { id, message, read } = req.body;
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "Token is missing!" });
        }

        const [, token] = authHeader.split(' ');

        try {
            const decodedToken = verify(token, process.env.JWT_SECRET as string);
            const { sub: userId } = decodedToken as { sub: string };

            const upsertNotificationService = new UpsertNotificationService();

            const notification = await upsertNotificationService.execute({
                id,
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
