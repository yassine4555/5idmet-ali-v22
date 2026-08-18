import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Grade extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Institution', required: true, index: true })
  institutionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ClassGroup', required: true, index: true })
  classId: Types.ObjectId;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  type: string; // e.g., 'Exam', 'Quiz', 'Homework'

  @Prop({ required: true })
  score: number;

  @Prop({ default: 20 })
  maxScore: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  teacherId?: Types.ObjectId;

  @Prop()
  weight?: number;

  @Prop({ type: Date })
  date?: Date;

  @Prop()
  comment?: string;
}

export const GradeSchema = SchemaFactory.createForClass(Grade);
GradeSchema.index({ institutionId: 1, studentId: 1, classId: 1 });
