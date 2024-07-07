import { Response, Request } from "express";
import { CreateUserService } from '../../services/user/CreateUserService';

class CreateUserController {
    async handle(req: Request, res: Response) {
        const { name, email, password, role, departmentId } = req.body;
        const file = req.file?.buffer; // Agora o TypeScript sabe que req.file pode existir
        const createUserService = new CreateUserService();
        const user = await createUserService.execute({
            name,
            email,
            password,
            file,
            role,
            departmentId
        });

        return res.json(user);
    }
}

export { CreateUserController };
