import { Document, Types } from 'mongoose';
export declare class StudentProfile extends Document {
    userId: Types.ObjectId;
    institutionId: Types.ObjectId;
    studentRegistrationId: string;
    currentClassId: Types.ObjectId;
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
    academicInfo: {
        enrollmentDate?: Date;
        previousSchool?: string;
        currentGradeLevel?: string;
        specialties?: string[];
        currentGPA?: number;
        conductScore?: number;
    };
    medicalInfo: {
        bloodGroup?: string;
        allergies?: string[];
        chronicConditions?: string[];
        emergencyDoctorName?: string;
        emergencyDoctorPhone?: string;
        medicalNotes?: string;
    };
    financialInfo: {
        scholarshipPercentage?: number;
        tuitionCategory?: string;
        paymentPlan?: 'MONTHLY' | 'TRIMESTRIAL' | 'ANNUAL';
        accountBalance?: number;
    };
}
export declare const StudentProfileSchema: import("mongoose").Schema<StudentProfile, import("mongoose").Model<StudentProfile, any, any, any, Document<unknown, any, StudentProfile, any, {}> & StudentProfile & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StudentProfile, Document<unknown, {}, import("mongoose").FlatRecord<StudentProfile>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<StudentProfile> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
