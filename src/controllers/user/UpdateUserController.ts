import { Response, Request } from "express";
import { UpdateUserService } from '../../services/user/UpdateUserService';
import {PermissionUpdateUser} from '../../services/user/UserPermissions'

class UpdateUserController {
    async handle(req: Request, res: Response) {
        const { id, name, email, password, password_old, role, departmentId } = req.body;
        const file = req.file?.buffer;
        const updateUserService = new UpdateUserService();
        const permissionUpdateUser = new PermissionUpdateUser();
        const user_id = Number(req.user_id);

        if (Number(id) !== user_id) {
            console.log('Here')
            const hasPermission = await permissionUpdateUser.execute(user_id, Number(id));
            if (!hasPermission) {
                return res.status(403).json({ error: "You do not have permission to update this user" });
            }
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
    }
}

export { UpdateUserController };
