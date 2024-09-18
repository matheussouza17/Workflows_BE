import prismaClient from '../../prisma';


class GetManagerOfDepartment {
    async execute( id : number) {
        let useridManager = await prismaClient.department.findFirst({
            where:{
                id: id
            }
        });
        if(useridManager.approvalDirectorId){

            let userManager = await prismaClient.user.findFirst({
                where: {
                    id: useridManager.approvalDirectorId
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
        else{
            throw new Error('Department not has director!');
        }
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
