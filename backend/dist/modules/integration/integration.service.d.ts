export declare class IntegrationService {
    private readonly logger;
    handleStudentEnrolled(payload: any): void;
    handleInvoiceOverdue(payload: any): void;
    processIncomingParentWebhook(hookPayload: any): Promise<{
        status: string;
        timestamp: string;
    }>;
}
