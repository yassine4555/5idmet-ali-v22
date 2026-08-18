import { Document, Types } from 'mongoose';
export declare class Grade extends Document {
    institutionId: Types.ObjectId;
    studentId: Types.ObjectId;
    classId: Types.ObjectId;
    subject: string;
    type: string;
    score: number;
    maxScore: number;
    teacherId?: Types.ObjectId;
    weight?: number;
    date?: Date;
    comment?: string;
}
export declare const GradeSchema: import("mongoose").Schema<Grade, import("mongoose").Model<Grade, any, any, any, Document<unknown, any, Grade, any, {}> & Grade & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Grade, Document<unknown, {}, import("mongoose").FlatRecord<Grade>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Grade> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
