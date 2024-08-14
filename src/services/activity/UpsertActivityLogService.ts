import prismaClient from '../../prisma';

interface ActivityLogRequest {
    id?: number;
    processId: number;
    action: string;
    userId: number;
    description?: string;
}

class UpsertActivityLogService {
    async execute({ id, processId, action, userId, description }: ActivityLogRequest) {
        if (!processId || !action || !userId) {
            throw new Error("Process ID, action, and user ID are mandatory.");
        }

        try {
            let activityLog;

            if (id) {
                const existingActivityLog = await prismaClient.activityLog.findUnique({
                    where: { id }
                });

                if (!existingActivityLog) {
                    throw new Error(`Activity Log with id: ${id} not found`);
                }

                activityLog = await prismaClient.activityLog.update({
                    where: { id: id },
                    data: {
                        processId,
                        action,
                        userId,
                        description
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
            } else {
                activityLog = await prismaClient.activityLog.create({
                    data: {
                        processId,
                        action,
                        userId,
                        description
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
            }

            return activityLog;

        } catch (error) {
            throw new Error(`Error in upserting activity log: ${error.message}`);
        }
    }
}

export { UpsertActivityLogService };
