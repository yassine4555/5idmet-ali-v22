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
exports.GradesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const grade_schema_1 = require("../../schemas/grade.schema");
let GradesService = class GradesService {
    constructor(gradeModel) {
        this.gradeModel = gradeModel;
    }
    async list(filter) {
        const q = {};
        if (filter.studentId && mongoose_2.Types.ObjectId.isValid(filter.studentId))
            q.studentId = new mongoose_2.Types.ObjectId(filter.studentId);
        if (filter.classId && mongoose_2.Types.ObjectId.isValid(filter.classId))
            q.classId = new mongoose_2.Types.ObjectId(filter.classId);
        if (filter.subject)
            q.subject = filter.subject;
        return this.gradeModel.find(q).lean().exec();
    }
    async get(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid grade ID');
        const g = await this.gradeModel.findById(id).lean().exec();
        if (!g)
            throw new common_1.NotFoundException('Grade not found');
        return g;
    }
    async create(dto) {
        if (!mongoose_2.Types.ObjectId.isValid(dto.studentId))
            throw new common_1.BadRequestException('Invalid student ID');
        if (!mongoose_2.Types.ObjectId.isValid(dto.classId))
            throw new common_1.BadRequestException('Invalid class ID');
        const grade = await this.gradeModel.create({
            institutionId: new mongoose_2.Types.ObjectId('000000000000000000000001'),
            studentId: new mongoose_2.Types.ObjectId(dto.studentId),
            classId: new mongoose_2.Types.ObjectId(dto.classId),
            subject: dto.subject,
            type: dto.type,
            score: dto.score,
            maxScore: dto.maxScore || 20,
            teacherId: mongoose_2.Types.ObjectId.isValid(dto.teacherId) ? new mongoose_2.Types.ObjectId(dto.teacherId) : undefined,
            date: dto.date ? new Date(dto.date) : new Date(),
            comment: dto.comment || '',
        });
        return { message: 'Grade saved', grade };
    }
    async update(id, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid grade ID');
        const grade = await this.gradeModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).lean().exec();
        if (!grade)
            throw new common_1.NotFoundException('Grade not found');
        return { message: 'Grade updated', grade };
    }
    async delete(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid grade ID');
        const g = await this.gradeModel.findByIdAndDelete(id).lean().exec();
        if (!g)
            throw new common_1.NotFoundException('Grade not found');
        return { message: 'Grade deleted', id };
    }
};
exports.GradesService = GradesService;
exports.GradesService = GradesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(grade_schema_1.Grade.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], GradesService);
//# sourceMappingURL=grades.service.js.map