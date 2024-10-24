import { Request, Response } from "express";
import { GetUserService } from "../../services/user/GetUserByIdService";

class GetUserControllerByIdController {
  async handle(req: Request, res: Response) {
    const { id } = req.params; // Pega o ID do usuário da URL

    const getUserService = new GetUserService();

    try {
      // Como o id vem como string, precisamos transformá-lo em número
      const user = await getUserService.execute(Number(id));
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { GetUserControllerByIdController };
