import { Response, Request } from "express";
import { GetCategoryService } from '../../services/category/GetCategoryService';

class GetCategoryController {
    async handle(req: Request, res: Response) {
        const getCategoryService = new GetCategoryService();
        const { id } = req.params;

        // Extraindo o token do cabeçalho de autorização
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "Token is missing!" });
        }

        try {
            // Verificação e conversão de ID para número, se fornecido
            const categoryId = id ? Number(id) : undefined;
            if (categoryId && isNaN(categoryId)) {
                return res.status(400).json({ error: "Invalid ID format!" });
            }

            const categories = await getCategoryService.execute({
                id: categoryId
            });

            return res.json(categories);

        } catch (error) {
            return res.status(500).json({ error: "Internal server error!" });
        }
    }
}

export { GetCategoryController };
