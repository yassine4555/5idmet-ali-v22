import { Controller, Post, Body } from '@nestjs/common';
import { IntegrationService } from './integration.service';

@Controller('api/v1/integration')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post('webhooks')
  async handleWebhook(@Body() body: any) {
    return this.integrationService.processIncomingParentWebhook(body);
  }
}
