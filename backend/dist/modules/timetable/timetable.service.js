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
exports.TimetableService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const timetable_schema_1 = require("../../schemas/timetable.schema");
let TimetableService = class TimetableService {
    constructor(timetableModel) {
        this.timetableModel = timetableModel;
    }
    async list(filter) {
        const q = {};
        if (filter.classId && mongoose_2.Types.ObjectId.isValid(filter.classId))
            q.classId = new mongoose_2.Types.ObjectId(filter.classId);
        if (filter.teacherId && mongoose_2.Types.ObjectId.isValid(filter.teacherId))
            q.teacherId = new mongoose_2.Types.ObjectId(filter.teacherId);
        return this.timetableModel
            .find(q)
            .populate('classId', 'name level')
            .populate('teacherId', 'firstName lastName email')
            .lean()
            .exec();
    }
    async get(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid timetable entry ID');
        const e = await this.timetableModel
            .findById(id)
            .populate('classId', 'name level')
            .populate('teacherId', 'firstName lastName email')
            .lean()
            .exec();
        if (!e)
            throw new common_1.NotFoundException('Timetable entry not found');
        return e;
    }
    async create(dto) {
        if (!mongoose_2.Types.ObjectId.isValid(dto.classId))
            throw new common_1.BadRequestException('Invalid class ID');
        if (!mongoose_2.Types.ObjectId.isValid(dto.teacherId))
            throw new common_1.BadRequestException('Invalid teacher ID');
        const institutionId = dto.institutionId && mongoose_2.Types.ObjectId.isValid(dto.institutionId)
            ? new mongoose_2.Types.ObjectId(dto.institutionId)
            : new mongoose_2.Types.ObjectId('000000000000000000000001');
        const entry = await this.timetableModel.create({
            institutionId,
            classId: new mongoose_2.Types.ObjectId(dto.classId),
            teacherId: new mongoose_2.Types.ObjectId(dto.teacherId),
            subject: dto.subject,
            startTime: new Date(dto.startTime),
            endTime: new Date(dto.endTime),
            location: dto.location || '',
            notes: dto.notes || '',
        });
        return { message: 'Timetable entry created', entry };
    }
    async update(id, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid timetable entry ID');
        const entry = await this.timetableModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).lean().exec();
        if (!entry)
            throw new common_1.NotFoundException('Timetable entry not found');
        return { message: 'Timetable entry updated', entry };
    }
    async delete(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid timetable entry ID');
        const e = await this.timetableModel.findByIdAndDelete(id).lean().exec();
        if (!e)
            throw new common_1.NotFoundException('Timetable entry not found');
        return { message: 'Timetable entry deleted', id };
    }
};
exports.TimetableService = TimetableService;
exports.TimetableService = TimetableService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(timetable_schema_1.TimetableEntry.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TimetableService);
//# sourceMappingURL=timetable.service.js.map