import prismaClient from '../../prisma';

class PermissionUpdateUser {
    async execute(userManagerId: number, userUpdatedId: number): Promise<boolean> {
        const userManager = await prismaClient.user.findFirst({
            where: { id: userManagerId }
        });
        
        const userUpdated = await prismaClient.user.findFirst({
            where: { id: userUpdatedId }
        });

        if (!userManager || !userUpdated) {
            throw new Error("User not found");
        }

        if (userManager.role === 'CFO' || userManager.role === 'Accounting' ) {
            return true;
        }

        if (userManager.role === 'Director' || userManager.role === 'Manager') {
            if (userManager.departmentId === userUpdated.departmentId) {
                return true;
            } else {
                return false;
            }
        }

        return false;
    }
}

class PermissionGetUser {
    async execute(userManagerId: number): Promise<boolean> {
        const userManager = await prismaClient.user.findFirst({
            where: { id: userManagerId }
        });
        

        if (!userManager) {
            throw new Error("User not found");
        }

        if (userManager.role === 'CFO' || userManager.role === 'Director' || userManager.role === 'Manager'|| userManager.role ==='Accounting') {
            return true;
        }

        return false;
    }
}


export { PermissionUpdateUser, PermissionGetUser};
