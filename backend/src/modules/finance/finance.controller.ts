import { Controller, Get, Post, Put, Delete, Param, Query, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { InvoiceStatus } from '../../schemas/invoice.schema';

@Controller('api/v1/finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  // GET /api/v1/finance/summary
  @Get('summary')
  async getSummary() {
    return this.financeService.getFinanceSummary();
  }

  // GET /api/v1/finance/invoices?status=OVERDUE
  @Get('invoices')
  async getInvoices(@Query('status') status?: string) {
    return this.financeService.getInvoices(status);
  }

  // GET /api/v1/finance/invoices/:id
  @Get('invoices/:id')
  async getInvoice(@Param('id') id: string) {
    return this.financeService.getInvoice(id);
  }

  // POST /api/v1/finance/invoices
  @Post('invoices')
  @HttpCode(HttpStatus.CREATED)
  async createInvoice(@Body() body: {
    studentId: string;
    institutionId?: string;
    description: string;
    items?: Array<{ description: string; amount: number }>;
    totalAmount: number;
    dueDate: string;
  }) {
    return this.financeService.createInvoice(body);
  }

  // PUT /api/v1/finance/invoices/:id
  @Put('invoices/:id')
  async updateInvoice(
    @Param('id') id: string,
    @Body() body: { paidAmount?: number; status?: InvoiceStatus; dueDate?: string },
  ) {
    return this.financeService.updateInvoice(id, body);
  }

  // DELETE /api/v1/finance/invoices/:id
  @Delete('invoices/:id')
  @HttpCode(HttpStatus.OK)
  async deleteInvoice(@Param('id') id: string) {
    return this.financeService.deleteInvoice(id);
  }

  // POST /api/v1/finance/invoices/:id/remind
  @Post('invoices/:id/remind')
  async sendReminder(@Param('id') id: string) {
    return this.financeService.sendReminder(id);
  }
}
