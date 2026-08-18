import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class TimetableEntry extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Institution', required: true, index: true })
  institutionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ClassGroup', required: true, index: true })
  classId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  teacherId: Types.ObjectId;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop()
  location?: string;

  @Prop()
  notes?: string;
}

export const TimetableEntrySchema = SchemaFactory.createForClass(TimetableEntry);
TimetableEntrySchema.index({ institutionId: 1, classId: 1, startTime: 1 });
