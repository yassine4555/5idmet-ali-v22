import { Model, Types } from 'mongoose';
import { Invoice, InvoiceStatus } from '../../schemas/invoice.schema';
export declare class FinanceService {
    private invoiceModel;
    constructor(invoiceModel: Model<Invoice>);
    getFinanceSummary(): Promise<{
        totalInvoiced: number;
        totalCollected: number;
        totalOverdue: number;
        overdueCount: number;
        recoveryRate: number;
        currency: string;
    }>;
    getInvoices(status?: string): Promise<(import("mongoose").FlattenMaps<Invoice> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getInvoice(id: string): Promise<import("mongoose").FlattenMaps<Invoice> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    createInvoice(dto: {
        studentId: string;
        institutionId?: string;
        description: string;
        items?: Array<{
            description: string;
            amount: number;
        }>;
        totalAmount: number;
        dueDate: string;
    }): Promise<{
        message: string;
        invoice: import("mongoose").Document<unknown, {}, Invoice, {}, {}> & Invoice & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    updateInvoice(id: string, dto: {
        paidAmount?: number;
        status?: InvoiceStatus;
        dueDate?: string;
    }): Promise<{
        message: string;
        invoice: import("mongoose").Document<unknown, {}, Invoice, {}, {}> & Invoice & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    deleteInvoice(id: string): Promise<{
        message: string;
    }>;
    sendReminder(id: string): Promise<{
        success: boolean;
        message: string;
        invoiceId: string;
        sentAt: string;
        newReminderCount: number;
    }>;
}
