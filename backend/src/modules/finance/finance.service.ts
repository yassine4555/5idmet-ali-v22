import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice, InvoiceStatus } from '../../schemas/invoice.schema';

@Injectable()
export class FinanceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
  ) {}

  // ─── READ: Financial summary metrics ────────────────────────────────────
  async getFinanceSummary() {
    const invoices = await this.invoiceModel.find().lean().exec();

    const totalInvoiced = invoices.reduce((s, i) => s + i.totalAmount, 0);
    const totalCollected = invoices.reduce((s, i) => s + i.paidAmount, 0);
    const overdueInvoices = invoices.filter((i) => i.status === InvoiceStatus.OVERDUE);
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

  // ─── READ: List invoices with optional status filter ────────────────────
  async getInvoices(status?: string) {
    const filter: any = {};
    if (status && status !== 'ALL') filter.status = status;
    const invoices = await this.invoiceModel.find(filter).lean().exec();
    return invoices;
  }

  // ─── READ: Single invoice ────────────────────────────────────────────────
  async getInvoice(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid invoice ID');
    const invoice = await this.invoiceModel.findById(id).lean().exec();
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  // ─── CREATE: New invoice ─────────────────────────────────────────────────
  async createInvoice(dto: {
    studentId: string;
    institutionId?: string;
    description: string;
    items?: Array<{ description: string; amount: number }>;
    totalAmount: number;
    dueDate: string;
  }) {
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    const institutionId = Types.ObjectId.isValid(dto.institutionId || '')
      ? new Types.ObjectId(dto.institutionId)
      : new Types.ObjectId('000000000000000000000001');

    if (!Types.ObjectId.isValid(dto.studentId)) {
      throw new BadRequestException('Invalid student ID');
    }

    const invoice = await this.invoiceModel.create({
      institutionId,
      invoiceNumber,
      studentId: new Types.ObjectId(dto.studentId),
      items: dto.items || [{ description: dto.description, amount: dto.totalAmount }],
      totalAmount: dto.totalAmount,
      paidAmount: 0,
      status: InvoiceStatus.PENDING,
      dueDate: new Date(dto.dueDate),
      reminderCount: 0,
    });

    return { message: 'Invoice created successfully', invoice };
  }

  // ─── UPDATE: Record a payment or change status ───────────────────────────
  async updateInvoice(id: string, dto: {
    paidAmount?: number;
    status?: InvoiceStatus;
    dueDate?: string;
  }) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid invoice ID');

    const invoice = await this.invoiceModel.findById(id).exec();
    if (!invoice) throw new NotFoundException('Invoice not found');

    if (dto.paidAmount !== undefined) {
      invoice.paidAmount = dto.paidAmount;
      // Auto-compute status from payment
      if (dto.paidAmount >= invoice.totalAmount) {
        invoice.status = InvoiceStatus.PAID;
      } else if (dto.paidAmount > 0) {
        invoice.status = InvoiceStatus.PARTIALLY_PAID;
      }
    }
    if (dto.status) invoice.status = dto.status;
    if (dto.dueDate) invoice.dueDate = new Date(dto.dueDate);

    await invoice.save();
    return { message: 'Invoice updated', invoice };
  }

  // ─── DELETE: Cancel/remove invoice ──────────────────────────────────────
  async deleteInvoice(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid invoice ID');
    const invoice = await this.invoiceModel.findByIdAndDelete(id).exec();
    if (!invoice) throw new NotFoundException('Invoice not found');
    return { message: `Invoice ${invoice.invoiceNumber} deleted` };
  }

  // ─── ACTION: Send payment reminder ──────────────────────────────────────
  async sendReminder(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid invoice ID');

    const invoice = await this.invoiceModel.findByIdAndUpdate(
      id,
      {
        $inc: { reminderCount: 1 },
        $set: { lastReminderSentAt: new Date() },
      },
      { new: true },
    ).exec();

    if (!invoice) throw new NotFoundException('Invoice not found');

    return {
      success: true,
      message: `Relance envoyée pour la facture ${invoice.invoiceNumber}`,
      invoiceId: id,
      sentAt: new Date().toISOString(),
      newReminderCount: invoice.reminderCount,
    };
  }
}
