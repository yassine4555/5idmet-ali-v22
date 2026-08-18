import { Model } from 'mongoose';
import { Conversation, Message } from '../../schemas/message.schema';
export declare class MessagingService {
    private conversationModel;
    private messageModel;
    constructor(conversationModel: Model<Conversation>, messageModel: Model<Message>);
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
    getMessages(conversationId: string): Promise<{
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
    createMessage(payload: any): Promise<{
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
    toggleReaction(messageId: string, userId: string, emoji: string): Promise<{
        messageId: string;
        userId: string;
        emoji: string;
        count: number;
    }>;
}
