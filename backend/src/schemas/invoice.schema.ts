import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class Invoice extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Institution', required: true, index: true })
  institutionId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  invoiceNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  payerParentId?: Types.ObjectId;

  @Prop({ type: Array, default: [] })
  items: Array<{ description: string; amount: number }>;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: 0 })
  paidAmount: number;

  @Prop({ required: true, enum: InvoiceStatus, default: InvoiceStatus.PENDING, index: true })
  status: InvoiceStatus;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ type: Date })
  lastReminderSentAt?: Date;

  @Prop({ default: 0 })
  reminderCount: number;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
InvoiceSchema.index({ institutionId: 1, status: 1 });
