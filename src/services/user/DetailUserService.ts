import prismaClient from "../../prisma";

class DetailUserService {
    async execute(user_id: string) {
        const userClient = await prismaClient.user.findFirst({
            where: {
                id: Number(user_id)
            },
            select: {
                id: true,
                name: true,
                email: true,
                file: true,
                role: true,
                createdAt: true,
                departmentId: true
            }
        });

        if (!userClient) {
            throw new Error("User not found");
        }

        // Converte o arquivo binário para base64
        const userWithBase64File = {
            ...userClient,
            file: userClient.file ? userClient.file.toString('base64') : null
        };

        return userWithBase64File;
    }
}

export { DetailUserService };
