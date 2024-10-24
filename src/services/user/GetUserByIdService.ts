import prismaClient from "../../prisma";

class GetUserService {
  async execute(userId: number) {
    // Procuramos o usuário no banco de dados com o ID fornecido
    const user = await prismaClient.user.findUnique({
      where: { id: userId }, // Buscamos o usuário por ID
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        departmentId: true,
        createdAt: true, // Mostraremos a data de criação também
      },
    });

    // Se o usuário não existir, vamos lançar um erro, né?
    if (!user) {
      throw new Error("Usuário não encontrado. Parece que ele deu uma voltinha...");
    }

    return user; // Retorna os dados do usuário
  }
}

export { GetUserService };
