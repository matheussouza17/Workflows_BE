import { Response, Request } from "express";
import { GetApprovalListService } from '../../services/approval/GetApprovalListService';
import { verify } from 'jsonwebtoken';

class GetApprovalListController {
    async handle(req: Request, res: Response) {
        const authHeader = req.headers.authorization;
        const { name, number, categoryId } = req.params; 

        if (!authHeader) {
            return res.status(401).json({ error: "Token is missing!" });
        }

        const [, token] = authHeader.split(' ');

        try {
            const decodedToken = verify(token, process.env.JWT_SECRET as string);
            const { sub: userId } = decodedToken as { sub: string };

            const getApprovalListController = new GetApprovalListService();
            let approval = await getApprovalListController.execute({
                userid: Number(userId), 
                name: name, 
                number: number, 
                categoryId: Number(categoryId)
            });
            

            return res.json(approval);

        } catch (error) {
            return res.status(401).json({ error: "Invalid token!" });
        }
    }
}

export { GetApprovalListController };
