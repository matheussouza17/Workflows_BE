import prismaClient from '../../prisma';

interface ActivityLogRequest {
    id?: number;
    processId: number;
    action: string;
    userId: number;
    description?: string;
}

class GetActivityLogServiceByProcessId {
    async execute(processId) {
        let activity = prismaClient.activityLog.findMany({
            where:{
                processId: processId
            }
        })
        return activity;
    }
}

export { GetActivityLogServiceByProcessId };
