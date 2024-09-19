import prismaClient from "../../prisma";

class GetApprovalDetailService {
    async execute(approvalId: number, userid: number) {
        // Busca pela aprovação
        console.log("Approval ID:", approvalId);
        const approval = await prismaClient.approval.findFirst({
            where: {
                id: approvalId
            },
            include: {
                createdBy: true 
            }
        });

        // Verifica se a aprovação foi encontrada
        if (!approval) {
            throw new Error("Approval not found!");
        }

        // Busca pelo processo relacionado à aprovação
        const process = await prismaClient.process.findFirst({
            where: {
                approvalId: approvalId
            },
        });

        // Busca o usuário atual
        const userCurrent = await prismaClient.user.findFirst({
            where: {
                id: userid
            }
        });

        // Verifica se o usuário atual foi encontrado
        if (!userCurrent) {
            throw new Error("User not found!");
        }

        // Verifica se `createdBy` está presente antes de acessar `departmentId`
        if (!approval.createdBy) {
            throw new Error("Approval creator not found!");
        }

        // Busca o departamento do criador da aprovação
        const department = await prismaClient.department.findFirst({
            where: {
                id: approval.createdBy.departmentId
            }
        });

        // Verifica se o departamento foi encontrado
        if (!department) {
            throw new Error("Department not found!");
        }

        // Verifica as permissões do usuário com base no papel (role)
        if (userCurrent.role === 'CFO' || userCurrent.role === 'Accounting') {
            return {
                approval,
                process
            };
        } else if (userCurrent.role === 'Director' || userCurrent.role === 'Manager') {
            if (department.approvalDirectorId === userCurrent.id) {
                return {
                    approval,
                    process
                };
            }
        } else if (userCurrent.role === 'Employee') {
            if (approval.createdById === userCurrent.id) {
                return {
                    approval,
                    process
                };
            }
        }

        // Se o usuário não tiver permissões
        throw new Error("User does not have permissions!");
    }
}

export { GetApprovalDetailService };
