import { TimetableService } from './timetable.service';
export declare class TimetableController {
    private readonly timetableService;
    constructor(timetableService: TimetableService);
    list(classId?: string, teacherId?: string): Promise<(import("mongoose").FlattenMaps<import("../../schemas/timetable.schema").TimetableEntry> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    get(id: string): Promise<import("mongoose").FlattenMaps<import("../../schemas/timetable.schema").TimetableEntry> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    create(body: {
        classId: string;
        teacherId: string;
        subject: string;
        startTime: string;
        endTime: string;
        location?: string;
        notes?: string;
    }): Promise<{
        message: string;
        entry: import("mongoose").Document<unknown, {}, import("../../schemas/timetable.schema").TimetableEntry, {}, {}> & import("../../schemas/timetable.schema").TimetableEntry & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    update(id: string, body: any): Promise<{
        message: string;
        entry: import("mongoose").FlattenMaps<import("../../schemas/timetable.schema").TimetableEntry> & Required<{
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
