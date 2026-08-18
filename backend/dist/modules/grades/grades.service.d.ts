import { Model, Types } from 'mongoose';
import { Grade } from '../../schemas/grade.schema';
export declare class GradesService {
    private gradeModel;
    constructor(gradeModel: Model<Grade>);
    list(filter: {
        studentId?: string;
        classId?: string;
        subject?: string;
    }): Promise<(import("mongoose").FlattenMaps<Grade> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    get(id: string): Promise<import("mongoose").FlattenMaps<Grade> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    create(dto: {
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
        grade: import("mongoose").Document<unknown, {}, Grade, {}, {}> & Grade & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    update(id: string, dto: any): Promise<{
        message: string;
        grade: import("mongoose").FlattenMaps<Grade> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    delete(id: string): Promise<{
        message: string;
        id: string;
    }>;
}
