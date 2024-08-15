import { Response, Request } from "express";
import { UpsertCategoryService } from '../../services/category/UpsertCategoryService';
import { verify } from 'jsonwebtoken';

class UpsertCategoryController {
    async handle(req: Request, res: Response) {
        const { name, description } = req.body;
        const authHeader = req.headers.authorization;
        const { id } = req.params; 

        if (!authHeader) {
            return res.status(401).json({ error: "Token is missing!" });
        }

        const [, token] = authHeader.split(' ');

        try {
            const decodedToken = verify(token, process.env.JWT_SECRET as string);
            const { sub: userId } = decodedToken as { sub: string };
            
            const upsertCategoryService = new UpsertCategoryService();

            const category = await upsertCategoryService.execute({
                id:Number(id),
                name,
                description,
                userid: parseInt(userId) // convertendo para número, se necessário
            });

            return res.json(category);

        } catch (error) {
            return res.status(401).json({ error: "Invalid token!" });
        }
    }
}

export { UpsertCategoryController };
