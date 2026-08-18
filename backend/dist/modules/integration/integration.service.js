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
var IntegrationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let IntegrationService = IntegrationService_1 = class IntegrationService {
    constructor() {
        this.logger = new common_1.Logger(IntegrationService_1.name);
    }
    handleStudentEnrolled(payload) {
        this.logger.log(`[Parent App Sync] Dispatching student.enrolled webhook to parent system:`, payload);
    }
    handleInvoiceOverdue(payload) {
        this.logger.log(`[Parent App Sync] Dispatching invoice.overdue webhook to parent system:`, payload);
    }
    async processIncomingParentWebhook(hookPayload) {
        this.logger.log(`[Parent Hook Received] Processing parent event ${hookPayload.event}`, hookPayload.data);
        return { status: 'PROCESSED', timestamp: new Date().toISOString() };
    }
};
exports.IntegrationService = IntegrationService;
__decorate([
    (0, event_emitter_1.OnEvent)('student.enrolled'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IntegrationService.prototype, "handleStudentEnrolled", null);
__decorate([
    (0, event_emitter_1.OnEvent)('invoice.overdue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IntegrationService.prototype, "handleInvoiceOverdue", null);
exports.IntegrationService = IntegrationService = IntegrationService_1 = __decorate([
    (0, common_1.Injectable)()
], IntegrationService);
//# sourceMappingURL=integration.service.js.map