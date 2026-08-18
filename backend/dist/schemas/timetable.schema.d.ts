import { Document, Types } from 'mongoose';
export declare class TimetableEntry extends Document {
    institutionId: Types.ObjectId;
    classId: Types.ObjectId;
    teacherId: Types.ObjectId;
    subject: string;
    startTime: Date;
    endTime: Date;
    location?: string;
    notes?: string;
}
export declare const TimetableEntrySchema: import("mongoose").Schema<TimetableEntry, import("mongoose").Model<TimetableEntry, any, any, any, Document<unknown, any, TimetableEntry, any, {}> & TimetableEntry & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TimetableEntry, Document<unknown, {}, import("mongoose").FlatRecord<TimetableEntry>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<TimetableEntry> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
