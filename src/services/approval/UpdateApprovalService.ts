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

class UpdateApprovalService {
    async execute({ id, number, name, categoryId, description, value, createdById }: ApprovalRequest) {
        if (!number || !name || !categoryId || !value || !createdById) {
            throw new Error("All fields are mandatory except description.");
        }

        try {
            let approval;

            if (id) {
                const existingApproval = await prismaClient.approval.findUnique({
                    where: { id }
                });

                if (!existingApproval) {
                    throw new Error(`Approval with id: ${id} not found`);
                }

                approval = await prismaClient.approval.update({
                    where: { id: id },
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
            } 
            return approval;

        } catch (error) {
            throw new Error(`Error in updating approval: ${error.message}`);
        }
    }
}

export { UpdateApprovalService };
