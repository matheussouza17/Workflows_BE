import { Response, Request } from "express";
import { GetActivityLogServiceByProcessId } from '../../services/activity/GetActivityLogService';
import { verify } from 'jsonwebtoken';

class GetActivityLogController {
    async handle(req: Request, res: Response) {
        const authHeader = req.headers.authorization;
        const { processid } = req.params;

        if (!authHeader) {
            return res.status(401).json({ error: "Token is missing!" });
        }

        const [, token] = authHeader.split(' ');

        try {
            // Verificar o token JWT
            const decodedToken = verify(token, process.env.JWT_SECRET as string);

            // Verificar se o processid é válido e convertê-lo para número
            const processIdNumber = Number(processid);
            if (isNaN(processIdNumber)) {
                return res.status(400).json({ error: "Invalid Process ID format!" });
            }

            const getActivityLogServiceByProcessId = new GetActivityLogServiceByProcessId();

            // Executar o serviço com o processId convertido para número
            let activityList = await getActivityLogServiceByProcessId.execute(processIdNumber);

            return res.json(activityList);
        } catch (error) {
            console.error("Token verification error:", error);
            return res.status(401).json({ error: "Invalid token!" });
        }
    }
}

export { GetActivityLogController };
