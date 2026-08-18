import { Model, Types } from 'mongoose';
import { StudentProfile } from '../../schemas/student-profile.schema';
import { User } from '../../schemas/user.schema';
import { ConfigService } from '@nestjs/config';
export declare class StudentsService {
    private studentProfileModel;
    private userModel;
    private configService;
    constructor(studentProfileModel: Model<StudentProfile>, userModel: Model<User>, configService: ConfigService);
    findAll(query: {
        search?: string;
        status?: string;
        classId?: string;
        level?: string;
    }): Promise<{
        id: Types.ObjectId;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        status: string;
        avatarUrl: string;
        registrationId: string;
        currentGradeLevel: string;
        gpa: number;
        paymentStatus: string;
    }[]>;
    getProfile(userId: string): Promise<{
        user: {
            id: Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            avatarUrl: string;
            status: string;
        };
        profile: import("mongoose").FlattenMaps<StudentProfile> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    createStudent(dto: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        institutionId: string;
        personalInfo?: any;
        academicInfo?: any;
        medicalInfo?: any;
        financialInfo?: any;
    }): Promise<{
        message: string;
        tempPassword: string;
        user: {
            id: Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            status: string;
        };
        profile: {
            id: Types.ObjectId;
            registrationId: string;
        };
    }>;
    updateStudent(userId: string, dto: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        status?: string;
        personalInfo?: any;
        academicInfo?: any;
        medicalInfo?: any;
        financialInfo?: any;
    }): Promise<{
        message: string;
        user: import("mongoose").FlattenMaps<User> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        profile: import("mongoose").FlattenMaps<StudentProfile> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    deleteStudent(userId: string): Promise<{
        message: string;
    }>;
}
