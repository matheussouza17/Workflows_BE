import { Response, Request } from "express";
import { UpsertDepartmentService } from '../../services/department/UpsertDepartmentService';

class UpsertDepartmentController {
    async handle(req: Request, res: Response) {
        const {id, code, name, approvalDirectorId} = req.body;
        const upsertDepartmentService = new UpsertDepartmentService();

        const department = upsertDepartmentService.execute({
            id,
            code,
            name,
            approvalDirectorId
        });

        return res.json(department);

    }
}

export { UpsertDepartmentController };
