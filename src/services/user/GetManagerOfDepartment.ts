import prismaClient from '../../prisma';


class GetManagerOfDepartment {
    async execute( id : number) {
        let userManager = await prismaClient.user.findFirst({
            where: {
                departmentId: id,
                role: { in: ['Director', 'Manager'] }
            },
            select:{
                id: true,
                name: true,
                email: true,
                file: true,
                role: true,
                createdAt: true,
                departmentId: true
            }
        });

        return userManager;
    }
    async accounting() {
        let userManager = await prismaClient.user.findFirst({
            where: {
                role: 'Accounting'
            },
            select:{
                departmentId: true
            }
        });

        return userManager;
    }
}

export { GetManagerOfDepartment };
