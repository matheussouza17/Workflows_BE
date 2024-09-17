import prismaClient from '../../prisma';
import { GetManagerOfDepartment } from '../user/GetManagerOfDepartment';

interface ProcessRequest {
    id: number;
    approvalId: number;
    departmentFromId?: number;
    departmentToId?: number;
    roleFrom?: 'Employee' | 'Manager' | 'Director' | 'Accounting' | 'CFO';
    roleTo?: 'Employee' | 'Manager' | 'Director' | 'Accounting' | 'CFO';
    executedById: number;
    userToId?: number;
    comment?: string;
    action: 'Approved' | 'Rejected' | 'Cancelled' | 'NotExecuted';
    status?: 'Pending' | 'InProgress' | 'Completed' | 'Cancelled';
}

class UpdateProcessService {
    async execute({ id, approvalId, executedById, comment, action }: ProcessRequest) {
        const getManagerOfDepartment = new GetManagerOfDepartment();

        let approval = await prismaClient.approval.findFirst({
            where: { id: Number(approvalId) },
        });

        if (!approval) {
            throw new Error('Approval not found');
        }

        let userCurrent = await prismaClient.user.findFirst({
            where: { id: Number(executedById) },
        });

        if (!userCurrent) {
            throw new Error('Executing user not found');
        }

        let userCreated = await prismaClient.user.findFirst({
            where: { id: approval.createdById },
        });

        if (!userCreated) {
            throw new Error('User who created approval not found');
        }

        let departmentFromId, departmentToId, roleFrom, roleTo, userToId, status;

        if (userCurrent.role === 'Director' || userCurrent.role === 'Manager') {
            departmentFromId = userCurrent.departmentId;
            roleFrom = 'Director';
            if (action === 'Approved') {
                departmentToId = getManagerOfDepartment.accounting();
                status = 'InProgress';
                roleTo = 'Accounting';
                userToId = null;
            } else if (action === 'Rejected') {
                departmentToId = userCreated.departmentId;
                status = 'Pending';
                userToId = userCreated.id;
            } else if (action === 'Cancelled') {
                status = 'Cancelled';
                departmentToId = null;
            }
        } else if (userCurrent.role === 'Accounting') {
            departmentFromId = userCurrent.departmentId;
            roleFrom = 'Accounting';
            if (action === 'Approved') {
                departmentToId = getManagerOfDepartment.accounting();
                status = 'Completed';
                roleTo = null;
                userToId = null;
            } else if (action === 'Rejected') {
                departmentToId = userCreated.departmentId;
                status = 'Pending';
                userToId = null;
            } else if (action === 'Cancelled') {
                status = 'Cancelled';
                departmentToId = null;
            }
        } else {
            throw new Error('Application does not support this operation!');
        }

        try {
            const existingProcess = await prismaClient.process.findUnique({
                where: { id },
            });

            if (!existingProcess) {
                throw new Error(`Process with id: ${id} not found`);
            }

            const process = await prismaClient.process.update({
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
                    status,
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
                    status: true,
                },
            });

            return process;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error in upserting process: ${error.message}`);
            } else {
                throw new Error('Unknown error occurred while upserting process');
            }
        }
    }
}

export { UpdateProcessService };
