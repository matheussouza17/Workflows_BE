import { Response, Request } from "express";
import { GetActivityLogServiceByProcessId } from '../../services/activity/GetActivityLogService';
import { verify } from 'jsonwebtoken';


class GetActivityLogController{
    async handle(req: Request, res: Response){
        const authHeader = req.headers.authorization;
        const { processid } = req.params; 

        if (!authHeader) {
            return res.status(401).json({ error: "Token is missing!" });
        }

        const [, token] = authHeader.split(' ');

        try {
            const decodedToken = verify(token, process.env.JWT_SECRET as string);
            const getActivityLogServiceByProcessId = new GetActivityLogServiceByProcessId();
            
            let activityList = await getActivityLogServiceByProcessId.execute(processid);

            return res.json(activityList);

        } catch (error) {
            console.error("Token verification error:", error);
            return res.status(401).json({ error: "Invalid token!" });
        }
    }
}
export{GetActivityLogController}