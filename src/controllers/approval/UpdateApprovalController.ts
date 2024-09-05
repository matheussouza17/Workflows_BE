import { Response, Request } from "express";
import { UpdateApprovalService } from '../../services/approval/UpdateApprovalService';
import { verify } from 'jsonwebtoken';

class UpdateApprovalController {
    async handle(req: Request, res: Response) {
        const { number, name, categoryId, description, value } = req.body;
        const authHeader = req.headers.authorization;
        const { id } = req.params; 

        if (!authHeader) {
            return res.status(401).json({ error: "Token is missing!" });
        }

        const [, token] = authHeader.split(' ');
        if(!id){
            return res.status(401).json({ error: "Id is missing!" });
        }

        try {
            const decodedToken = verify(token, process.env.JWT_SECRET as string);
            const { sub: userId } = decodedToken as { sub: string };

            const upsertApprovalService = new UpdateApprovalService();

            const approval = await upsertApprovalService.execute({
                id:Number(id),
                number,
                name,
                categoryId,
                description,
                value,
                createdById: Number(userId) 
            });

            return res.json(approval);

        } catch (error) {
            return res.status(401).json({ error: "Invalid token!" });
        }
    }
}

export { UpdateApprovalController };
