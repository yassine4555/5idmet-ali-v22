import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation, Message } from '../../schemas/message.schema';

@Injectable()
export class MessagingService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async getConversations() {
    // Return sample channels & direct chats matching 2c spec
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

  async getMessages(conversationId: string) {
    // Initial seeded chat stream for 2c demo view
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

  async createMessage(payload: any) {
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

  async toggleReaction(messageId: string, userId: string, emoji: string) {
    return { messageId, userId, emoji, count: 1 };
  }
}
