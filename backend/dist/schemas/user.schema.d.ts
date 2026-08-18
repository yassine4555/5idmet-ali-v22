import { Document, Types } from 'mongoose';
export declare enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    INSTITUTION_ADMIN = "INSTITUTION_ADMIN",
    TEACHER = "TEACHER",
    STUDENT = "STUDENT",
    PARENT = "PARENT",
    STAFF = "STAFF"
}
export declare class User extends Document {
    institutionId: Types.ObjectId;
    parentAppUserId?: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    avatarUrl?: string;
    phone?: string;
    status: string;
    associatedChildrenIds?: Types.ObjectId[];
    lastLoginAt?: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<User> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
