import { Response, Request } from "express";
import { GetApprovalDetailService } from '../../services/approval/GetApprovalDetailService';
import { verify } from 'jsonwebtoken';

class GetApprovalDetailController {
    async handle(req: Request, res: Response) {
        const authHeader = req.headers.authorization;
        const { id } = req.params; 

        if (!authHeader) {
            return res.status(401).json({ error: "Token is missing!" });
        }

        const [, token] = authHeader.split(' ');

        try {
            const decodedToken = verify(token, process.env.JWT_SECRET as string);
            const { sub: userId } = decodedToken as { sub: string };
            const getApprovalDetailService = new GetApprovalDetailService();
            
            let approval = await getApprovalDetailService.execute(
                Number(id),
                Number(userId)
            );
            

            return res.json(approval);

        } catch (error) {
            console.error("Token verification error:", error);
            return res.status(401).json({ error: "Invalid token!" });
        }
    }
}

export { GetApprovalDetailController };
