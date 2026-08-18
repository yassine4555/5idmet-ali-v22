import { Model, Types } from 'mongoose';
import { TimetableEntry } from '../../schemas/timetable.schema';
export declare class TimetableService {
    private timetableModel;
    constructor(timetableModel: Model<TimetableEntry>);
    list(filter: {
        classId?: string;
        teacherId?: string;
    }): Promise<(import("mongoose").FlattenMaps<TimetableEntry> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    get(id: string): Promise<import("mongoose").FlattenMaps<TimetableEntry> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    create(dto: {
        classId: string;
        teacherId: string;
        subject: string;
        startTime: string;
        endTime: string;
        location?: string;
        notes?: string;
    }): Promise<{
        message: string;
        entry: import("mongoose").Document<unknown, {}, TimetableEntry, {}, {}> & TimetableEntry & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    update(id: string, dto: any): Promise<{
        message: string;
        entry: import("mongoose").FlattenMaps<TimetableEntry> & Required<{
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
