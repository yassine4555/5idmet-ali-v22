import { Server, Socket } from 'socket.io';
import { MessagingService } from './messaging.service';
export declare class MessagingGateway {
    private readonly messagingService;
    server: Server;
    constructor(messagingService: MessagingService);
    handleJoinRoom(client: Socket, conversationId: string): {
        event: string;
        conversationId: string;
    };
    handleSendMessage(payload: {
        conversationId: string;
        senderId: string;
        content: string;
        attachments?: any[];
    }): Promise<{
        id: string;
        conversationId: any;
        sender: {
            id: any;
            name: string;
            role: string;
            avatar: string;
        };
        content: any;
        attachments: any;
        reactions: any[];
        createdAt: string;
    }>;
    handleReaction(payload: {
        messageId: string;
        userId: string;
        emoji: string;
    }): Promise<{
        messageId: string;
        userId: string;
        emoji: string;
        count: number;
    }>;
}
