import { Document, Types } from 'mongoose';
export declare class TeacherProfile extends Document {
    userId: Types.ObjectId;
    institutionId: Types.ObjectId;
    employeeNumber: string;
    personalInfo: {
        dateOfBirth?: Date;
        gender?: 'MALE' | 'FEMALE' | 'OTHER';
        address?: string;
        phone?: string;
    };
    professionalInfo: {
        hireDate?: Date;
        subjects?: string[];
        bio?: string;
        qualifications?: string[];
    };
    assignedClassIds?: Types.ObjectId[];
}
export declare const TeacherProfileSchema: import("mongoose").Schema<TeacherProfile, import("mongoose").Model<TeacherProfile, any, any, any, Document<unknown, any, TeacherProfile, any, {}> & TeacherProfile & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TeacherProfile, Document<unknown, {}, import("mongoose").FlatRecord<TeacherProfile>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<TeacherProfile> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
