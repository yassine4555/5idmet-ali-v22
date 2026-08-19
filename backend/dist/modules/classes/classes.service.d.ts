import { Model } from 'mongoose';
import { ClassGroup } from '../../schemas/class-group.schema';
import { StudentProfile } from '../../schemas/student-profile.schema';
export declare class ClassesService {
    private classModel;
    private studentProfileModel;
    constructor(classModel: Model<ClassGroup>, studentProfileModel: Model<StudentProfile>);
    findAll(search?: string): Promise<any[]>;
    getById(id: string): Promise<any>;
    create(dto: {
        institutionId?: string;
        name: string;
        level: string;
        academicYear: string;
        mainTeacherId?: string;
        studentIds?: string[];
    }): Promise<{
        message: string;
        classGroup: any;
    }>;
    update(id: string, dto: Partial<{
        name: string;
        level: string;
        academicYear: string;
        mainTeacherId: string;
        studentIds: string[];
    }>): Promise<{
        message: string;
        classGroup: any;
    }>;
    delete(id: string): Promise<{
        message: string;
        id: string;
    }>;
}
