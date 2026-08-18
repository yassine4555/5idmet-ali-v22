import { Document } from 'mongoose';
export declare enum InstitutionType {
    PRIMARY_SCHOOL = "PRIMARY_SCHOOL",
    MIDDLE_SCHOOL = "MIDDLE_SCHOOL",
    HIGH_SCHOOL = "HIGH_SCHOOL",
    UNIVERSITY = "UNIVERSITY",
    TRAINING_CENTER = "TRAINING_CENTER"
}
export declare class Institution extends Document {
    name: string;
    type: InstitutionType;
    slug: string;
    logoUrl?: string;
    address: {
        street?: string;
        city?: string;
        postalCode?: string;
        country?: string;
    };
    settings: {
        academicYearStart?: string;
        academicYearEnd?: string;
        gradingSystem?: string;
        currency?: string;
    };
    isActive: boolean;
}
export declare const InstitutionSchema: import("mongoose").Schema<Institution, import("mongoose").Model<Institution, any, any, any, Document<unknown, any, Institution, any, {}> & Institution & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Institution, Document<unknown, {}, import("mongoose").FlatRecord<Institution>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Institution> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
