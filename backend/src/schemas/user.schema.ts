import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  INSTITUTION_ADMIN = 'INSTITUTION_ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  STAFF = 'STAFF',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Institution', required: true, index: true })
  institutionId: Types.ObjectId;

  @Prop({ index: true })
  parentAppUserId?: string; // Foreign ID for Parent Application Integration Bridge

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ required: true, enum: UserRole, index: true })
  role: UserRole;

  @Prop()
  avatarUrl?: string;

  @Prop()
  phone?: string;

  @Prop({ default: 'ACTIVE', enum: ['ACTIVE', 'SUSPENDED', 'PENDING'] })
  status: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  associatedChildrenIds?: Types.ObjectId[];

  @Prop({ type: Date })
  lastLoginAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ institutionId: 1, email: 1 }, { unique: true });
