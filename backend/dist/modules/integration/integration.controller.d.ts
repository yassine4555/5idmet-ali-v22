import { IntegrationService } from './integration.service';
export declare class IntegrationController {
    private readonly integrationService;
    constructor(integrationService: IntegrationService);
    handleWebhook(body: any): Promise<{
        status: string;
        timestamp: string;
    }>;
}
