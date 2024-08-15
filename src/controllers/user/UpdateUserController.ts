import { Response, Request } from "express";
import { UpdateUserService } from '../../services/user/UpdateUserService';
import { PermissionUpdateUser } from '../../services/user/UserPermissions';
import { verify } from 'jsonwebtoken';

class UpdateUserController {
    async handle(req: Request, res: Response) {
        const { name, email, password, password_old, role, departmentId } = req.body;
        const file = req.file?.buffer;
        const updateUserService = new UpdateUserService();
        const permissionUpdateUser = new PermissionUpdateUser();

        const { id } = req.params; // Extraindo o id da URL

        // Extraindo o token do cabeçalho de autorização
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "Token is missing!" });
        }

        const [, token] = authHeader.split(' ');

        try {
            // Decodificando o token para extrair o user_id
            const decodedToken = verify(token, process.env.JWT_SECRET as string);
            const { sub: user_id } = decodedToken as { sub: string };

            // Verificação de permissão
            const hasPermission = await permissionUpdateUser.execute(Number(user_id), Number(id));
            if (!hasPermission) {
                return res.status(403).json({ error: "You do not have permission to update this user" });
            }

            const user = await updateUserService.execute({
                id: Number(id),
                name,
                email,
                password,
                password_old,
                file,
                role,
                departmentId
            });

            return res.json(user);

        } catch (error) {
            return res.status(401).json({ error: "Invalid token!" });
        }
    }
}

export { UpdateUserController };
