import { Response, Request } from "express";
import { CreateApprovalService } from '../../services/approval/CreateApprovalService';
import { CreateProcessService } from '../../services/process/CreateProcessService';
import { verify } from 'jsonwebtoken';

class CreateApprovalController {
    async handle(req: Request, res: Response) {
        const { number, name, categoryId, description, value } = req.body;
        const authHeader = req.headers.authorization;
        const { id } = req.params; 

        if (!authHeader) {
            return res.status(401).json({ error: "Token is missing!" });
        }

        const [, token] = authHeader.split(' ');

        try {
            const decodedToken = verify(token, process.env.JWT_SECRET as string);
            const { sub: userId } = decodedToken as { sub: string };

            const createApprovalService = new CreateApprovalService();

            let approval = await createApprovalService.execute({
                number,
                name,
                categoryId,
                description,
                value,
                createdById: Number(userId) 
            });
            const createProcessService = new CreateProcessService();
            const processCreated = await createProcessService.execute(approval.id);

            return res.json({
                approval,
                processCreated
            });
            

        } catch (error) {
            return res.status(401).json({ error: "Invalid token!" });
        }
    }
}

export { CreateApprovalController };
