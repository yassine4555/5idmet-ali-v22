import { StudentsService } from './students.service';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    findAll(search?: string, status?: string, classId?: string, level?: string): Promise<{
        id: import("mongoose").Types.ObjectId;
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
    getProfile(id: string): Promise<{
        user: {
            id: import("mongoose").Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            avatarUrl: string;
            status: string;
        };
        profile: import("mongoose").FlattenMaps<import("../../schemas/student-profile.schema").StudentProfile> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    createStudent(body: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        institutionId?: string;
        personalInfo?: any;
        academicInfo?: any;
        medicalInfo?: any;
        financialInfo?: any;
    }): Promise<{
        message: string;
        tempPassword: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            status: string;
        };
        profile: {
            id: import("mongoose").Types.ObjectId;
            registrationId: string;
        };
    }>;
    updateStudent(id: string, body: {
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
        user: import("mongoose").FlattenMaps<import("../../schemas/user.schema").User> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        profile: import("mongoose").FlattenMaps<import("../../schemas/student-profile.schema").StudentProfile> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    deleteStudent(id: string): Promise<{
        message: string;
    }>;
}
