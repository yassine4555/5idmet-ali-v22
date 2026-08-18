import { GradesService } from './grades.service';
export declare class GradesController {
    private readonly gradesService;
    constructor(gradesService: GradesService);
    list(studentId?: string, classId?: string, subject?: string): Promise<(import("mongoose").FlattenMaps<import("../../schemas/grade.schema").Grade> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    get(id: string): Promise<import("mongoose").FlattenMaps<import("../../schemas/grade.schema").Grade> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    create(body: {
        studentId: string;
        classId: string;
        subject: string;
        type: string;
        score: number;
        maxScore?: number;
        teacherId?: string;
        date?: string;
        comment?: string;
    }): Promise<{
        message: string;
        grade: import("mongoose").Document<unknown, {}, import("../../schemas/grade.schema").Grade, {}, {}> & import("../../schemas/grade.schema").Grade & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    update(id: string, body: any): Promise<{
        message: string;
        grade: import("mongoose").FlattenMaps<import("../../schemas/grade.schema").Grade> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    delete(id: string): Promise<{
        message: string;
        id: string;
    }>;
}
