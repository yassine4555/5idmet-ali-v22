import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class StudentProfile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Institution', required: true, index: true })
  institutionId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  studentRegistrationId: string; // Matricule / Student ID

  @Prop({ type: Types.ObjectId, ref: 'ClassGroup', index: true })
  currentClassId: Types.ObjectId;

  // Tab 1: Personal Data
  @Prop({ type: Object })
  personalInfo: {
    dateOfBirth?: Date;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    nationality?: string;
    nationalIdNumber?: string;
    address?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
  };

  // Tab 2: Academic Data
  @Prop({ type: Object })
  academicInfo: {
    enrollmentDate?: Date;
    previousSchool?: string;
    currentGradeLevel?: string;
    specialties?: string[];
    currentGPA?: number;
    conductScore?: number;
  };

  // Tab 3: Medical Records (Protected)
  @Prop({ type: Object })
  medicalInfo: {
    bloodGroup?: string;
    allergies?: string[];
    chronicConditions?: string[];
    emergencyDoctorName?: string;
    emergencyDoctorPhone?: string;
    medicalNotes?: string;
  };

  // Tab 4: Financial Summary
  @Prop({ type: Object })
  financialInfo: {
    scholarshipPercentage?: number;
    tuitionCategory?: string;
    paymentPlan?: 'MONTHLY' | 'TRIMESTRIAL' | 'ANNUAL';
    accountBalance?: number;
  };
}

export const StudentProfileSchema = SchemaFactory.createForClass(StudentProfile);
