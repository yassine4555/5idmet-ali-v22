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
exports.MessagingGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const messaging_service_1 = require("./messaging.service");
let MessagingGateway = class MessagingGateway {
    constructor(messagingService) {
        this.messagingService = messagingService;
    }
    handleJoinRoom(client, conversationId) {
        client.join(`conversation_${conversationId}`);
        return { event: 'joined', conversationId };
    }
    async handleSendMessage(payload) {
        const msg = await this.messagingService.createMessage(payload);
        this.server.to(`conversation_${payload.conversationId}`).emit('newMessage', msg);
        return msg;
    }
    async handleReaction(payload) {
        const updated = await this.messagingService.toggleReaction(payload.messageId, payload.userId, payload.emoji);
        this.server.emit('messageReactionUpdated', updated);
        return updated;
    }
};
exports.MessagingGateway = MessagingGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessagingGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinConversation'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], MessagingGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagingGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('toggleReaction'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagingGateway.prototype, "handleReaction", null);
exports.MessagingGateway = MessagingGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } }),
    __metadata("design:paramtypes", [messaging_service_1.MessagingService])
], MessagingGateway);
//# sourceMappingURL=messaging.gateway.js.map