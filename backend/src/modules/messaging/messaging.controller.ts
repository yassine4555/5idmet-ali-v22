import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { MessagingService } from './messaging.service';

@Controller('api/v1/messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get('conversations')
  async getConversations() {
    return this.messagingService.getConversations();
  }

  @Get('conversations/:id/messages')
  async getMessages(@Param('id') id: string) {
    return this.messagingService.getMessages(id);
  }

  @Post('messages')
  async createMessage(@Body() body: any) {
    return this.messagingService.createMessage(body);
  }
}
