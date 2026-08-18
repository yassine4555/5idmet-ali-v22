import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class TeacherProfile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Institution', required: true, index: true })
  institutionId: Types.ObjectId;

  @Prop({ required: true })
  employeeNumber: string; // internal teacher id

  @Prop({ type: Object })
  personalInfo: {
    dateOfBirth?: Date;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    address?: string;
    phone?: string;
  };

  @Prop({ type: Object })
  professionalInfo: {
    hireDate?: Date;
    subjects?: string[];
    bio?: string;
    qualifications?: string[];
  };

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ClassGroup' }] })
  assignedClassIds?: Types.ObjectId[];
}

export const TeacherProfileSchema = SchemaFactory.createForClass(TeacherProfile);
