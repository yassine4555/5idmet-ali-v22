import { Model } from 'mongoose';
import { ClassGroup } from '../../schemas/class-group.schema';
export declare class ClassesService {
    private classModel;
    constructor(classModel: Model<ClassGroup>);
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
