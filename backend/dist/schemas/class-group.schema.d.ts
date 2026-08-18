import { Document, Types } from 'mongoose';
export declare class ClassGroup extends Document {
    institutionId: Types.ObjectId;
    name: string;
    level: string;
    academicYear: string;
    mainTeacherId?: Types.ObjectId;
    studentIds: Types.ObjectId[];
}
export declare const ClassGroupSchema: import("mongoose").Schema<ClassGroup, import("mongoose").Model<ClassGroup, any, any, any, Document<unknown, any, ClassGroup, any, {}> & ClassGroup & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ClassGroup, Document<unknown, {}, import("mongoose").FlatRecord<ClassGroup>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ClassGroup> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
