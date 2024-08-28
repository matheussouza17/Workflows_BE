import prismaClient from '../../prisma';

interface DepartmentRequest {
    id?: number;
    code?: string;
    name?: string;
    approvalDirectorId?: number;
}

class GetDepartmentService {
    async execute({ id, code }: DepartmentRequest) {
        const departments = await prismaClient.department.findMany({
            where: {
                ...(id && { id }),
                ...(code && { code })
            }
        });

        return departments;
    }
}

export { GetDepartmentService };
