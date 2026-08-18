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
exports.MessagingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const message_schema_1 = require("../../schemas/message.schema");
let MessagingService = class MessagingService {
    constructor(conversationModel, messageModel) {
        this.conversationModel = conversationModel;
        this.messageModel = messageModel;
    }
    async getConversations() {
        return [
            {
                id: 'conv_terminales_s1',
                title: 'Classe Terminales S1',
                type: 'CLASS_CHANNEL',
                unreadCount: 3,
                lastMessage: 'N oubliez pas de rendre le DM de Physique pour demain 8h !',
                updatedAt: new Date().toISOString(),
                participantsCount: 28,
                avatar: '📚',
            },
            {
                id: 'conv_prof_maths',
                title: 'Mme. Claire Bernard (Maths)',
                type: 'DIRECT_MESSAGE',
                unreadCount: 0,
                lastMessage: 'Votre note au Devoir N°2 a été mise à jour.',
                updatedAt: new Date(Date.now() - 3600000).toISOString(),
                participantsCount: 2,
                avatar: '👩‍🏫',
            },
            {
                id: 'conv_admin_announcements',
                title: 'Annonces Direction & Vie Scolaire',
                type: 'ANNOUNCEMENT',
                unreadCount: 1,
                lastMessage: 'Calendrier des conseils de classe du 2ème Trimestre.',
                updatedAt: new Date(Date.now() - 86400000).toISOString(),
                participantsCount: 450,
                avatar: '📢',
            },
        ];
    }
    async getMessages(conversationId) {
        return [
            {
                id: 'msg_1',
                conversationId,
                sender: { id: 'u_prof1', name: 'M. Thomas Dubois', role: 'TEACHER', avatar: '👨‍🏫' },
                content: 'Bonjour à tous. Le support du chapitre 4 sur les équations différentielles est disponible.',
                attachments: [
                    { name: 'Chapitre_4_Equations_Diff.pdf', fileUrl: '#', fileType: 'pdf', sizeBytes: 2450000 },
                ],
                reactions: [{ userId: 'u_student1', emoji: '👍' }, { userId: 'u_student2', emoji: '❤️' }],
                createdAt: new Date(Date.now() - 7200000).toISOString(),
            },
            {
                id: 'msg_2',
                conversationId,
                sender: { id: 'u_student1', name: 'Lucas Martin', role: 'STUDENT', avatar: '👨‍🎓' },
                content: 'Merci Monsieur ! Est-ce que l exercice 15 p. 104 est facultatif ?',
                attachments: [],
                reactions: [{ userId: 'u_prof1', emoji: '👌' }],
                createdAt: new Date(Date.now() - 3600000).toISOString(),
            },
            {
                id: 'msg_3',
                conversationId,
                sender: { id: 'u_prof1', name: 'M. Thomas Dubois', role: 'TEACHER', avatar: '👨‍🏫' },
                content: 'Oui facultatif mais vivement recommandé pour préparer le DST !',
                attachments: [],
                reactions: [{ userId: 'u_student1', emoji: '🔥' }],
                createdAt: new Date(Date.now() - 1800000).toISOString(),
            },
        ];
    }
    async createMessage(payload) {
        return {
            id: `msg_${Date.now()}`,
            conversationId: payload.conversationId,
            sender: { id: payload.senderId, name: 'Vous', role: 'STUDENT', avatar: '👤' },
            content: payload.content,
            attachments: payload.attachments || [],
            reactions: [],
            createdAt: new Date().toISOString(),
        };
    }
    async toggleReaction(messageId, userId, emoji) {
        return { messageId, userId, emoji, count: 1 };
    }
};
exports.MessagingService = MessagingService;
exports.MessagingService = MessagingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(message_schema_1.Conversation.name)),
    __param(1, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], MessagingService);
//# sourceMappingURL=messaging.service.js.map