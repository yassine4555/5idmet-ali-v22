"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const invoice_schema_1 = require("../../schemas/invoice.schema");
let FinanceService = class FinanceService {
    constructor(invoiceModel) {
        this.invoiceModel = invoiceModel;
    }
    async getFinanceSummary() {
        const invoices = await this.invoiceModel.find().lean().exec();
        const totalInvoiced = invoices.reduce((s, i) => s + i.totalAmount, 0);
        const totalCollected = invoices.reduce((s, i) => s + i.paidAmount, 0);
        const overdueInvoices = invoices.filter((i) => i.status === invoice_schema_1.InvoiceStatus.OVERDUE);
        const totalOverdue = overdueInvoices.reduce((s, i) => s + (i.totalAmount - i.paidAmount), 0);
        return {
            totalInvoiced,
            totalCollected,
            totalOverdue,
            overdueCount: overdueInvoices.length,
            recoveryRate: totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0,
            currency: 'EUR',
        };
    }
    async getInvoices(status) {
        const filter = {};
        if (status && status !== 'ALL')
            filter.status = status;
        const invoices = await this.invoiceModel.find(filter).lean().exec();
        return invoices;
    }
    async getInvoice(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid invoice ID');
        const invoice = await this.invoiceModel.findById(id).lean().exec();
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        return invoice;
    }
    async createInvoice(dto) {
        const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
        const institutionId = mongoose_2.Types.ObjectId.isValid(dto.institutionId || '')
            ? new mongoose_2.Types.ObjectId(dto.institutionId)
            : new mongoose_2.Types.ObjectId('000000000000000000000001');
        if (!mongoose_2.Types.ObjectId.isValid(dto.studentId)) {
            throw new common_1.BadRequestException('Invalid student ID');
        }
        const invoice = await this.invoiceModel.create({
            institutionId,
            invoiceNumber,
            studentId: new mongoose_2.Types.ObjectId(dto.studentId),
            items: dto.items || [{ description: dto.description, amount: dto.totalAmount }],
            totalAmount: dto.totalAmount,
            paidAmount: 0,
            status: invoice_schema_1.InvoiceStatus.PENDING,
            dueDate: new Date(dto.dueDate),
            reminderCount: 0,
        });
        return { message: 'Invoice created successfully', invoice };
    }
    async updateInvoice(id, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid invoice ID');
        const invoice = await this.invoiceModel.findById(id).exec();
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        if (dto.paidAmount !== undefined) {
            invoice.paidAmount = dto.paidAmount;
            if (dto.paidAmount >= invoice.totalAmount) {
                invoice.status = invoice_schema_1.InvoiceStatus.PAID;
            }
            else if (dto.paidAmount > 0) {
                invoice.status = invoice_schema_1.InvoiceStatus.PARTIALLY_PAID;
            }
        }
        if (dto.status)
            invoice.status = dto.status;
        if (dto.dueDate)
            invoice.dueDate = new Date(dto.dueDate);
        await invoice.save();
        return { message: 'Invoice updated', invoice };
    }
    async deleteInvoice(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid invoice ID');
        const invoice = await this.invoiceModel.findByIdAndDelete(id).exec();
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        return { message: `Invoice ${invoice.invoiceNumber} deleted` };
    }
    async sendReminder(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid invoice ID');
        const invoice = await this.invoiceModel.findByIdAndUpdate(id, {
            $inc: { reminderCount: 1 },
            $set: { lastReminderSentAt: new Date() },
        }, { new: true }).exec();
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        return {
            success: true,
            message: `Relance envoyée pour la facture ${invoice.invoiceNumber}`,
            invoiceId: id,
            sentAt: new Date().toISOString(),
            newReminderCount: invoice.reminderCount,
        };
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(invoice_schema_1.Invoice.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FinanceService);
//# sourceMappingURL=finance.service.js.map