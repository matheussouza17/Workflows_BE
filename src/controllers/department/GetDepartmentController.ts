import { Response, Request } from "express";
import { GetDepartmentService } from '../../services/department/GetDepartmentService';

class GetDepartmentController {
    async handle(req: Request, res: Response) {
        const getDepartmentService = new GetDepartmentService();
        const { id, code } = req.params;

        // Extraindo o token do cabeçalho de autorização
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "Token is missing!" });
        }

        try {
            // Verificação e conversão de ID para número, se fornecido
            const departmentId = id ? Number(id) : undefined;
            if (departmentId && isNaN(departmentId)) {
                return res.status(400).json({ error: "Invalid ID format!" });
            }

            const departments = await getDepartmentService.execute({
                id: departmentId,
                code: code
            });
            return res.json(departments);

        } catch (error) {
            return res.status(500).json({ error: "Internal server error!" });
        }
    }
}

export { GetDepartmentController };
