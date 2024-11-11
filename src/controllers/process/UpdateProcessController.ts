import { Response, Request } from "express";
import { UpdateProcessService } from '../../services/process/UpdateProcessService';
import { verify } from 'jsonwebtoken';
import {UpsertActivityLogService} from '../../services/activity/UpsertActivityLogService'

class UpdateProcessController {
    async handle(req: Request, res: Response) {
        const { approvalId, comment, action } = req.body; // status removido, pois é calculado internamente
        const authHeader = req.headers.authorization;
        // Verificar se o token de autorização foi fornecido
        if (!authHeader) {
            return res.status(401).json({ error: "Token is missing!" });
        }

        const [, token] = authHeader.split(' ');

        try {
            // Decodificar o token JWT para extrair o userId
            const decodedToken = verify(token, process.env.JWT_SECRET as string);
            const { sub: userId } = decodedToken as { sub: string };

            // Verificar se todos os campos obrigatórios foram enviados
            if (!approvalId || !action) {
                return res.status(400).json({ error: "Approval ID and action are required!" });
            }
            
            const updateProcessService = new UpdateProcessService();  
            const upsertActivityLogService = new UpsertActivityLogService();  
            
            await upsertActivityLogService.execute(approvalId); 


            // Chamar o serviço para atualizar o processo
            const processData = await updateProcessService.execute({
                approvalId,     // ID da aprovação
                executedById: parseInt(userId), // ID do usuário executando a ação
                comment,        // Comentário opcional
                action          // Ação executada (Approved, Rejected, etc.)
                // O status será gerenciado dentro do serviço
            });

            // Retornar o dado do processo atualizado como resposta
            return res.json(processData);

        } catch (error) {
            console.error(error);
            return res.status(401).json({ error: "Invalid token or internal error!" });
        }
    }
}

export { UpdateProcessController };
