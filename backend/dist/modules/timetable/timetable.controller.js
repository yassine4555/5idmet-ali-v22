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
exports.TimetableController = void 0;
const common_1 = require("@nestjs/common");
const timetable_service_1 = require("./timetable.service");
let TimetableController = class TimetableController {
    constructor(timetableService) {
        this.timetableService = timetableService;
    }
    async list(classId, teacherId) {
        return this.timetableService.list({ classId, teacherId });
    }
    async get(id) {
        return this.timetableService.get(id);
    }
    async create(body) {
        return this.timetableService.create(body);
    }
    async update(id, body) {
        return this.timetableService.update(id, body);
    }
    async delete(id) {
        return this.timetableService.delete(id);
    }
};
exports.TimetableController = TimetableController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('classId')),
    __param(1, (0, common_1.Query)('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TimetableController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TimetableController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TimetableController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TimetableController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TimetableController.prototype, "delete", null);
exports.TimetableController = TimetableController = __decorate([
    (0, common_1.Controller)('api/v1/timetable'),
    __metadata("design:paramtypes", [timetable_service_1.TimetableService])
], TimetableController);
//# sourceMappingURL=timetable.controller.js.map