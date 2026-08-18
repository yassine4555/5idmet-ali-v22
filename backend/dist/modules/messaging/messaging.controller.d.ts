import { MessagingService } from './messaging.service';
export declare class MessagingController {
    private readonly messagingService;
    constructor(messagingService: MessagingService);
    getConversations(): Promise<{
        id: string;
        title: string;
        type: string;
        unreadCount: number;
        lastMessage: string;
        updatedAt: string;
        participantsCount: number;
        avatar: string;
    }[]>;
    getMessages(id: string): Promise<{
        id: string;
        conversationId: string;
        sender: {
            id: string;
            name: string;
            role: string;
            avatar: string;
        };
        content: string;
        attachments: {
            name: string;
            fileUrl: string;
            fileType: string;
            sizeBytes: number;
        }[];
        reactions: {
            userId: string;
            emoji: string;
        }[];
        createdAt: string;
    }[]>;
    createMessage(body: any): Promise<{
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
}
