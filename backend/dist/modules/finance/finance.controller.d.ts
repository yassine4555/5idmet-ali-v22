import { FinanceService } from './finance.service';
import { InvoiceStatus } from '../../schemas/invoice.schema';
export declare class FinanceController {
    private readonly financeService;
    constructor(financeService: FinanceService);
    getSummary(): Promise<{
        totalInvoiced: number;
        totalCollected: number;
        totalOverdue: number;
        overdueCount: number;
        recoveryRate: number;
        currency: string;
    }>;
    getInvoices(status?: string): Promise<(import("mongoose").FlattenMaps<import("../../schemas/invoice.schema").Invoice> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getInvoice(id: string): Promise<import("mongoose").FlattenMaps<import("../../schemas/invoice.schema").Invoice> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    createInvoice(body: {
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
        invoice: import("mongoose").Document<unknown, {}, import("../../schemas/invoice.schema").Invoice, {}, {}> & import("../../schemas/invoice.schema").Invoice & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    updateInvoice(id: string, body: {
        paidAmount?: number;
        status?: InvoiceStatus;
        dueDate?: string;
    }): Promise<{
        message: string;
        invoice: import("mongoose").Document<unknown, {}, import("../../schemas/invoice.schema").Invoice, {}, {}> & import("../../schemas/invoice.schema").Invoice & Required<{
            _id: import("mongoose").Types.ObjectId;
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
