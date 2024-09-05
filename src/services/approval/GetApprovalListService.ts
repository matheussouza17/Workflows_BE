import prismaClient from "../../prisma";

interface approval {
    number?: string;
    name?: string;
    categoryId?: number;
    userid?: number;
}

class GetApprovalListService {
    async execute ({userid, name, number, categoryId}:approval){
        let userCurrent = await prismaClient.user.findFirst({
            where: { id: userid }
        });
        
        if(!userCurrent){
            throw new Error("User not found");
        }
        let approval;

        if (userCurrent.role === 'CFO' || userCurrent.role === 'Accounting') {
            approval = await prismaClient.approval.findMany({
                where: {
                    ...(number && { number }),
                    ...(name && { name }),
                    ...(categoryId && {categoryId}),
                }
            });
        }
        
        else if (userCurrent.role === 'Director' || userCurrent.role === 'Manager') {
            approval = await prismaClient.approval.findMany({
                where: {
                    ...( number && { number }),
                    ...(name && { name }),
                    ...(categoryId && {categoryId}),
                    createdBy: {
                        departmentId: userCurrent.departmentId // Busca usuários do mesmo departamento
                    }
                },
                include: {
                    createdBy: true // Inclui informações sobre o usuário que criou a aprovação
                }
            });        
        }
        else if(userCurrent.role === `Employee`){
            approval = await prismaClient.approval.findMany({
                where: {
                    ...( number && { number }),
                    ...(name && { name }),
                    ...(categoryId && {categoryId}),
                    createdById: Number(userid)
                }
            });
        }
        else {
            throw new Error("User role not found");
        }

        return approval;        


    }
}

export {GetApprovalListService}

