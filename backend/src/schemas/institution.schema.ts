import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum InstitutionType {
  PRIMARY_SCHOOL = 'PRIMARY_SCHOOL',
  MIDDLE_SCHOOL = 'MIDDLE_SCHOOL',
  HIGH_SCHOOL = 'HIGH_SCHOOL',
  UNIVERSITY = 'UNIVERSITY',
  TRAINING_CENTER = 'TRAINING_CENTER',
}

@Schema({ timestamps: true })
export class Institution extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, enum: InstitutionType })
  type: InstitutionType;

  @Prop({ required: true, unique: true, lowercase: true })
  slug: string;

  @Prop()
  logoUrl?: string;

  @Prop({ type: Object })
  address: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };

  @Prop({ type: Object, default: {} })
  settings: {
    academicYearStart?: string;
    academicYearEnd?: string;
    gradingSystem?: string;
    currency?: string;
  };

  @Prop({ default: true })
  isActive: boolean;
}

export const InstitutionSchema = SchemaFactory.createForClass(Institution);
InstitutionSchema.index({ slug: 1 });
