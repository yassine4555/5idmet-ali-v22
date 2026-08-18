import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagingService } from './messaging.service';


@WebSocketGateway({ cors: { origin: '*' } })
export class MessagingGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagingService: MessagingService) {}

  @SubscribeMessage('joinConversation')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() conversationId: string) {
    client.join(`conversation_${conversationId}`);
    return { event: 'joined', conversationId };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() payload: { conversationId: string; senderId: string; content: string; attachments?: any[] },
  ) {
    const msg = await this.messagingService.createMessage(payload);
    this.server.to(`conversation_${payload.conversationId}`).emit('newMessage', msg);
    return msg;
  }

  @SubscribeMessage('toggleReaction')
  async handleReaction(
    @MessageBody() payload: { messageId: string; userId: string; emoji: string },
  ) {
    const updated = await this.messagingService.toggleReaction(payload.messageId, payload.userId, payload.emoji);
    this.server.emit('messageReactionUpdated', updated);
    return updated;
  }
}
