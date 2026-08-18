import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagingService } from './messaging.service';
import { MessagingController } from './messaging.controller';
import { MessagingGateway } from './messaging.gateway';
import { Conversation, ConversationSchema, Message, MessageSchema } from '../../schemas/message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [MessagingController],
  providers: [MessagingService, MessagingGateway],
  exports: [MessagingService],
})
export class MessagingModule {}
