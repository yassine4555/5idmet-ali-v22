import { Document, Types } from 'mongoose';
export declare enum InvoiceStatus {
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    PARTIALLY_PAID = "PARTIALLY_PAID",
    PAID = "PAID",
    OVERDUE = "OVERDUE",
    CANCELLED = "CANCELLED"
}
export declare class Invoice extends Document {
    institutionId: Types.ObjectId;
    invoiceNumber: string;
    studentId: Types.ObjectId;
    payerParentId?: Types.ObjectId;
    items: Array<{
        description: string;
        amount: number;
    }>;
    totalAmount: number;
    paidAmount: number;
    status: InvoiceStatus;
    dueDate: Date;
    lastReminderSentAt?: Date;
    reminderCount: number;
}
export declare const InvoiceSchema: import("mongoose").Schema<Invoice, import("mongoose").Model<Invoice, any, any, any, Document<unknown, any, Invoice, any, {}> & Invoice & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Invoice, Document<unknown, {}, import("mongoose").FlatRecord<Invoice>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Invoice> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
