import prismaClient from "../../prisma";

class GetUserService {
  async execute() {
    const userClient = await prismaClient.user.findMany({
        where: {
            role: {
              in: ['Manager', 'Director', 'Accounting', 'CFO'], // Inclui apenas os cargos que deseja
            },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        departmentId: true,
      },
    });

    if (!userClient || userClient.length === 0) {
      throw new Error("No users found with the specified roles");
    }

    return userClient;
  }
}

export { GetUserService };