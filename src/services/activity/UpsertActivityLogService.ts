import prismaClient from '../../prisma';

interface ActivityLogRequest {
    id?: number;
    processId: number;
    action: string;
    userId: number;
    description?: string;
}

class UpsertActivityLogService {
    async execute(approvalId) {
        let process_old = await prismaClient.process.findFirst({
            where: {
                approvalId: approvalId
            },
            orderBy: {
                processedAt: 'desc'
            }
        });

        if (!process_old) {
            throw new Error(`Process with approvalId: ${approvalId} not found`);
        }
        try {
            let activityLog = await prismaClient.activityLog.create({
                data: {
                    processId: process_old.id,
                    action: process_old.action,
                    userId: process_old.executedById,
                    description: process_old.comment
                },
                select: {
                    id: true,
                    processId: true,
                    action: true,
                    userId: true,
                    description: true,
                    timestamp: true
                }
            });

            return activityLog;

        } catch (error) {
            throw new Error(`Error in upserting activity log: ${error.message}`);
        }
    }
}


export { UpsertActivityLogService };
