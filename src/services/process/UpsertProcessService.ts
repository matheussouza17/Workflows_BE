import prismaClient from '../../prisma';

interface ProcessRequest {
    id?: number;
    approvalId: number;
    departmentFromId: number;
    departmentToId: number;
    roleFrom: 'Employee' | 'Manager' | 'Director' | 'Accounting' | 'CFO';
    roleTo: 'Employee' | 'Manager' | 'Director' | 'Accounting' | 'CFO';
    executedById: number;
    userToId?: number;
    comment?: string;
    action: 'Approved'| 'Rejected'| 'Cancelled'| 'NotExecuted';
    status: 'Pending' |'InProgress'|'Completed'|'Cancelled';
}

class UpsertProcessService {
    async execute({ id, approvalId, departmentFromId, departmentToId, roleFrom, roleTo, executedById, userToId, comment, action, status }: ProcessRequest) {
        if (!approvalId || !departmentFromId || !departmentToId || !roleFrom || !roleTo || !executedById || !action || !status) {
            throw new Error("All fields are mandatory except comment and userToId.");
        }

        try {
            let process;

            if (id) {
                const existingProcess = await prismaClient.process.findUnique({
                    where: { id }
                });

                if (!existingProcess) {
                    throw new Error(`Process with id: ${id} not found`);
                }

                process = await prismaClient.process.update({
                    where: { id: id },
                    data: {
                        approvalId,
                        departmentFromId,
                        departmentToId,
                        roleFrom,
                        roleTo,
                        executedById,
                        userToId,
                        comment,
                        action,
                        status
                    },
                    select: {
                        id: true,
                        approvalId: true,
                        departmentFromId: true,
                        departmentToId: true,
                        roleFrom: true,
                        roleTo: true,
                        executedById: true,
                        userToId: true,
                        comment: true,
                        action: true,
                        status: true
                    }
                });
            } else {
                process = await prismaClient.process.create({
                    data: {
                        approvalId,
                        departmentFromId,
                        departmentToId,
                        roleFrom,
                        roleTo,
                        executedById,
                        userToId,
                        comment,
                        action,
                        status
                    },
                    select: {
                        id: true,
                        approvalId: true,
                        departmentFromId: true,
                        departmentToId: true,
                        roleFrom: true,
                        roleTo: true,
                        executedById: true,
                        userToId: true,
                        comment: true,
                        action: true,
                        status: true
                    }
                });
            }

            return process;

        } catch (error) {
            throw new Error(`Error in upserting process: ${error.message}`);
        }
    }
}

export { UpsertProcessService };
