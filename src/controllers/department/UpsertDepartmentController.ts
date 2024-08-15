import { Response, Request } from "express";
import { UpsertDepartmentService } from '../../services/department/UpsertDepartmentService';

class UpsertDepartmentController {
    async handle(req: Request, res: Response) {
        const {code, name, approvalDirectorId} = req.body;
        const upsertDepartmentService = new UpsertDepartmentService();
        const authHeader = req.headers.authorization;
        const { id } = req.params; 

        if (!authHeader) {
            return res.status(401).json({ error: "Token is missing!" });
        }

        let department = await upsertDepartmentService.execute({
            id: Number(id),
            code,
            name,
            approvalDirectorId
        });
        console.log(department);
        return res.json(department);

    }
}

export { UpsertDepartmentController };
