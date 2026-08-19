import { TeachersService } from './teachers.service';
export declare class TeachersController {
    private readonly teachersService;
    constructor(teachersService: TeachersService);
    findAll(search?: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        status: string;
        avatarUrl: string;
        profile: import("mongoose").FlattenMaps<import("../../schemas/teacher-profile.schema").TeacherProfile> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        assignedClasses: any[];
    }[]>;
    getById(id: string): Promise<{
        user: import("mongoose").FlattenMaps<import("../../schemas/user.schema").User> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        profile: import("mongoose").FlattenMaps<import("../../schemas/teacher-profile.schema").TeacherProfile> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        assignedClasses: (import("mongoose").FlattenMaps<import("../../schemas/class-group.schema").ClassGroup> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    create(body: {
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
            id: import("mongoose").Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
        };
        profile: import("mongoose").Document<unknown, {}, import("../../schemas/teacher-profile.schema").TeacherProfile, {}, {}> & import("../../schemas/teacher-profile.schema").TeacherProfile & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    update(id: string, body: any): Promise<{
        message: string;
        user: import("mongoose").FlattenMaps<import("../../schemas/user.schema").User> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        profile: import("mongoose").FlattenMaps<import("../../schemas/teacher-profile.schema").TeacherProfile> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
