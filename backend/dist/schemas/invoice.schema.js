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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceSchema = exports.Invoice = exports.InvoiceStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["DRAFT"] = "DRAFT";
    InvoiceStatus["PENDING"] = "PENDING";
    InvoiceStatus["PARTIALLY_PAID"] = "PARTIALLY_PAID";
    InvoiceStatus["PAID"] = "PAID";
    InvoiceStatus["OVERDUE"] = "OVERDUE";
    InvoiceStatus["CANCELLED"] = "CANCELLED";
})(InvoiceStatus || (exports.InvoiceStatus = InvoiceStatus = {}));
let Invoice = class Invoice extends mongoose_2.Document {
};
exports.Invoice = Invoice;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Institution', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Invoice.prototype, "institutionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Invoice.prototype, "invoiceNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Invoice.prototype, "studentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Invoice.prototype, "payerParentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], Invoice.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Invoice.prototype, "totalAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Invoice.prototype, "paidAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: InvoiceStatus, default: InvoiceStatus.PENDING, index: true }),
    __metadata("design:type", String)
], Invoice.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Invoice.prototype, "dueDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Invoice.prototype, "lastReminderSentAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Invoice.prototype, "reminderCount", void 0);
exports.Invoice = Invoice = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Invoice);
exports.InvoiceSchema = mongoose_1.SchemaFactory.createForClass(Invoice);
exports.InvoiceSchema.index({ institutionId: 1, status: 1 });
//# sourceMappingURL=invoice.schema.js.map