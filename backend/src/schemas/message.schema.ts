import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Institution', required: true, index: true })
  institutionId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: ['CLASS_CHANNEL', 'DIRECT_MESSAGE', 'ANNOUNCEMENT'] })
  type: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  participantIds: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  lastMessageId?: Types.ObjectId;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Institution', required: true, index: true })
  institutionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true, index: true })
  conversationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Array, default: [] })
  attachments: Array<{ name: string; fileUrl: string; fileType: string; sizeBytes: number }>;

  @Prop({ type: Array, default: [] })
  reactions: Array<{ userId: Types.ObjectId; emoji: string }>;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  readBy: Types.ObjectId[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.index({ conversationId: 1, createdAt: -1 });
