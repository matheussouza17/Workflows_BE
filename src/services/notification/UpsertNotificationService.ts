import prismaClient from '../../prisma';

interface NotificationRequest {
    id?: number;
    userId: number;
    message: string;
    read?: boolean;
}

class UpsertNotificationService {
    async execute({ id, userId, message, read = false }: NotificationRequest) {
        if (!userId || !message) {
            throw new Error("User ID and message are mandatory.");
        }

        try {
            let notification;

            if (id) {
                const existingNotification = await prismaClient.notification.findUnique({
                    where: { id }
                });

                if (!existingNotification) {
                    throw new Error(`Notification with id: ${id} not found`);
                }

                notification = await prismaClient.notification.update({
                    where: { id: id },
                    data: {
                        userId,
                        message,
                        read
                    },
                    select: {
                        id: true,
                        userId: true,
                        message: true,
                        read: true,
                        createdAt: true
                    }
                });
            } else {
                notification = await prismaClient.notification.create({
                    data: {
                        userId,
                        message,
                        read
                    },
                    select: {
                        id: true,
                        userId: true,
                        message: true,
                        read: true,
                        createdAt: true
                    }
                });
            }

            return notification;

        } catch (error) {
            throw new Error(`Error in upserting notification: ${error.message}`);
        }
    }
}

export { UpsertNotificationService };
