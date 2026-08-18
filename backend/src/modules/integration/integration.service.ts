import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class IntegrationService {
  private readonly logger = new Logger(IntegrationService.name);

  // Listener for domain events that need to sync with Parent App
  @OnEvent('student.enrolled')
  handleStudentEnrolled(payload: any) {
    this.logger.log(`[Parent App Sync] Dispatching student.enrolled webhook to parent system:`, payload);
  }

  @OnEvent('invoice.overdue')
  handleInvoiceOverdue(payload: any) {
    this.logger.log(`[Parent App Sync] Dispatching invoice.overdue webhook to parent system:`, payload);
  }

  async processIncomingParentWebhook(hookPayload: any) {
    this.logger.log(`[Parent Hook Received] Processing parent event ${hookPayload.event}`, hookPayload.data);
    return { status: 'PROCESSED', timestamp: new Date().toISOString() };
  }
}
