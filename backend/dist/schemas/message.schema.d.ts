import { Document, Types } from 'mongoose';
export declare class Conversation extends Document {
    institutionId: Types.ObjectId;
    title: string;
    type: string;
    participantIds: Types.ObjectId[];
    lastMessageId?: Types.ObjectId;
}
export declare const ConversationSchema: import("mongoose").Schema<Conversation, import("mongoose").Model<Conversation, any, any, any, Document<unknown, any, Conversation, any, {}> & Conversation & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Conversation, Document<unknown, {}, import("mongoose").FlatRecord<Conversation>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Conversation> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
export declare class Message extends Document {
    institutionId: Types.ObjectId;
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    content: string;
    attachments: Array<{
        name: string;
        fileUrl: string;
        fileType: string;
        sizeBytes: number;
    }>;
    reactions: Array<{
        userId: Types.ObjectId;
        emoji: string;
    }>;
    readBy: Types.ObjectId[];
}
export declare const MessageSchema: import("mongoose").Schema<Message, import("mongoose").Model<Message, any, any, any, Document<unknown, any, Message, any, {}> & Message & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Message, Document<unknown, {}, import("mongoose").FlatRecord<Message>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Message> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
