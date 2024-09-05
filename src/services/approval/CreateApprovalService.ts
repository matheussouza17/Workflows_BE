import prismaClient from '../../prisma';

interface ApprovalRequest {
    id?: number;
    number: string;
    name: string;
    categoryId: number;
    description?: string;
    value: number;
    createdById: number;
}

class CreateApprovalService {
    async execute({ id, number, name, categoryId, description, value, createdById }: ApprovalRequest) {
        if (!number || !name || !categoryId || !value || !createdById) {
            throw new Error("All fields are mandatory except description.");
        }

        try {
            let approval;
            
                approval = await prismaClient.approval.create({
                    data: {
                        number,
                        name,
                        categoryId,
                        description,
                        value,
                        createdById
                    },
                    select: {
                        id: true,
                        number: true,
                        name: true,
                        description: true,
                        value: true
                    }
                });

            return approval;

        } catch (error) {
            throw new Error(`Error in upserting approval: ${error.message}`);
        }
    }
}

export { CreateApprovalService };
