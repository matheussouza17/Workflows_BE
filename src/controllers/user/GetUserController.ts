import { Request, Response } from "express";
import { GetUserService } from "../../services/user/GetUsersService";

class GetUserController {
  async handle(req: Request, res: Response) {
    const getUserService = new GetUserService();

    try {
      const users = await getUserService.execute();
      return res.json(users);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { GetUserController };
