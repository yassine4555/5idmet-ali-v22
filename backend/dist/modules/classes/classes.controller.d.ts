import { ClassesService } from './classes.service';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    findAll(search?: string): Promise<any[]>;
    getById(id: string): Promise<any>;
    create(body: {
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
    update(id: string, body: Partial<{
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
