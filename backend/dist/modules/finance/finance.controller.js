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
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const finance_service_1 = require("./finance.service");
let FinanceController = class FinanceController {
    constructor(financeService) {
        this.financeService = financeService;
    }
    async getSummary() {
        return this.financeService.getFinanceSummary();
    }
    async getInvoices(status) {
        return this.financeService.getInvoices(status);
    }
    async getInvoice(id) {
        return this.financeService.getInvoice(id);
    }
    async createInvoice(body) {
        return this.financeService.createInvoice(body);
    }
    async updateInvoice(id, body) {
        return this.financeService.updateInvoice(id, body);
    }
    async deleteInvoice(id) {
        return this.financeService.deleteInvoice(id);
    }
    async sendReminder(id) {
        return this.financeService.sendReminder(id);
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('invoices'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getInvoices", null);
__decorate([
    (0, common_1.Get)('invoices/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getInvoice", null);
__decorate([
    (0, common_1.Post)('invoices'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Put)('invoices/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "updateInvoice", null);
__decorate([
    (0, common_1.Delete)('invoices/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "deleteInvoice", null);
__decorate([
    (0, common_1.Post)('invoices/:id/remind'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "sendReminder", null);
exports.FinanceController = FinanceController = __decorate([
    (0, common_1.Controller)('api/v1/finance'),
    __metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map