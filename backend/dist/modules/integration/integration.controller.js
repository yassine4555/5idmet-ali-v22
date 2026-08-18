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
exports.IntegrationController = void 0;
const common_1 = require("@nestjs/common");
const integration_service_1 = require("./integration.service");
let IntegrationController = class IntegrationController {
    constructor(integrationService) {
        this.integrationService = integrationService;
    }
    async handleWebhook(body) {
        return this.integrationService.processIncomingParentWebhook(body);
    }
};
exports.IntegrationController = IntegrationController;
__decorate([
    (0, common_1.Post)('webhooks'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "handleWebhook", null);
exports.IntegrationController = IntegrationController = __decorate([
    (0, common_1.Controller)('api/v1/integration'),
    __metadata("design:paramtypes", [integration_service_1.IntegrationService])
], IntegrationController);
//# sourceMappingURL=integration.controller.js.map