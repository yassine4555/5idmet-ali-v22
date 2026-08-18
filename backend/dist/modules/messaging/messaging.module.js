"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const messaging_service_1 = require("./messaging.service");
const messaging_controller_1 = require("./messaging.controller");
const messaging_gateway_1 = require("./messaging.gateway");
const message_schema_1 = require("../../schemas/message.schema");
let MessagingModule = class MessagingModule {
};
exports.MessagingModule = MessagingModule;
exports.MessagingModule = MessagingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: message_schema_1.Conversation.name, schema: message_schema_1.ConversationSchema },
                { name: message_schema_1.Message.name, schema: message_schema_1.MessageSchema },
            ]),
        ],
        controllers: [messaging_controller_1.MessagingController],
        providers: [messaging_service_1.MessagingService, messaging_gateway_1.MessagingGateway],
        exports: [messaging_service_1.MessagingService],
    })
], MessagingModule);
//# sourceMappingURL=messaging.module.js.map