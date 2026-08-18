import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ClassGroup extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Institution', required: true, index: true })
  institutionId: Types.ObjectId;

  @Prop({ required: true })
  name: string; // e.g., "3ème B", "Terminales S1"

  @Prop({ required: true })
  level: string;

  @Prop({ required: true })
  academicYear: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  mainTeacherId?: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  studentIds: Types.ObjectId[];
}

export const ClassGroupSchema = SchemaFactory.createForClass(ClassGroup);
