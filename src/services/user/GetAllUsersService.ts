import prismaClient from "../../prisma";

class GetAllUserService {
  async execute(userid: number) {
    let userClient;

    const user = await prismaClient.user.findFirst({
        where: { id: userid }
    });

    let userRole = user.role;
    let departmentId = user.departmentId;

    if (userRole === 'Accounting') {
      userClient = await prismaClient.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          departmentId: true,
        },
      });
    } else if (userRole === 'Manager' || userRole === 'Director') {
      userClient = await prismaClient.user.findMany({
        where: {
          departmentId: departmentId,
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
    } else {
      userClient = [];
    }

    if (!userClient || userClient.length === 0) {
      throw new Error("No users found with the specified roles");
    }

    return userClient;
  }
}

export { GetAllUserService };
