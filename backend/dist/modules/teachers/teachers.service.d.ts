import { Model, Types } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { TeacherProfile } from '../../schemas/teacher-profile.schema';
import { ClassGroup } from '../../schemas/class-group.schema';
export declare class TeachersService {
    private userModel;
    private teacherProfileModel;
    private classGroupModel;
    constructor(userModel: Model<User>, teacherProfileModel: Model<TeacherProfile>, classGroupModel: Model<ClassGroup>);
    findAll(query: {
        search?: string;
    }): Promise<{
        id: Types.ObjectId;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        status: string;
        avatarUrl: string;
        profile: import("mongoose").FlattenMaps<TeacherProfile> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        assignedClasses: any[];
    }[]>;
    getById(id: string): Promise<{
        user: import("mongoose").FlattenMaps<User> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        profile: import("mongoose").FlattenMaps<TeacherProfile> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        assignedClasses: (import("mongoose").FlattenMaps<ClassGroup> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    createTeacher(dto: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        institutionId?: string;
        professionalInfo?: any;
        personalInfo?: any;
    }): Promise<{
        message: string;
        tempPassword: string;
        user: {
            id: Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
        };
        profile: import("mongoose").Document<unknown, {}, TeacherProfile, {}, {}> & TeacherProfile & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    updateTeacher(id: string, dto: any): Promise<{
        message: string;
        user: import("mongoose").FlattenMaps<User> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        profile: import("mongoose").FlattenMaps<TeacherProfile> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    deleteTeacher(id: string): Promise<{
        message: string;
    }>;
}
