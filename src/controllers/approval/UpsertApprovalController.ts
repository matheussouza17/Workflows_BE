import { Response, Request } from "express";
import { UpsertApprovalService } from '../../services/approval/UpsertApprovalService';
import { verify } from 'jsonwebtoken';

class UpsertApprovalController {
    async handle(req: Request, res: Response) {
        const { id, number, name, categoryId, description, value } = req.body;
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "Token is missing!" });
        }

        const [, token] = authHeader.split(' ');

        try {
            const decodedToken = verify(token, process.env.JWT_SECRET as string);
            const { sub: userId } = decodedToken as { sub: string };

            const upsertApprovalService = new UpsertApprovalService();

            const approval = await upsertApprovalService.execute({
                id,
                number,
                name,
                categoryId,
                description,
                value,
                createdById: parseInt(userId) // convertendo para número, se necessário
            });

            return res.json(approval);

        } catch (error) {
            return res.status(401).json({ error: "Invalid token!" });
        }
    }
}

export { UpsertApprovalController };
