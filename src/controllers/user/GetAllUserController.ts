import { Request, Response } from "express";
import { GetAllUserService } from "../../services/user/GetAllUsersService";
import { PermissionGetUser } from '../../services/user/UserPermissions';
import { verify } from 'jsonwebtoken';

class GetAllUserController {
  async handle(req: Request, res: Response) {
    const getUserService = new GetAllUserService();
    const permissionGetUser = new PermissionGetUser();
    const authHeader = req.headers.authorization;
    const [, token] = authHeader.split(' ');
    const decodedToken = verify(token, process.env.JWT_SECRET as string);
    const { sub: user_id } = decodedToken as { sub: string };

    // Verificação de permissão
    const hasPermission = await permissionGetUser.execute(Number(user_id));
    if (!hasPermission) {
        return res.status(403).json({ error: "You do not have permission" });
    }

    try {
      const users = await getUserService.execute(parseInt(user_id));
      return res.json(users);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { GetAllUserController };
