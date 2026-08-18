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
exports.ClassesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const class_group_schema_1 = require("../../schemas/class-group.schema");
let ClassesService = class ClassesService {
    constructor(classModel) {
        this.classModel = classModel;
    }
    async findAll(search) {
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { level: { $regex: search, $options: 'i' } },
                { academicYear: { $regex: search, $options: 'i' } },
            ];
        }
        const classes = await this.classModel.find(query).lean().exec();
        return classes.map((classGroup) => ({
            ...classGroup,
            studentCount: classGroup.studentIds?.length || 0,
        }));
    }
    async getById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid class ID');
        const classGroup = await this.classModel.findById(id).lean().exec();
        if (!classGroup)
            throw new common_1.NotFoundException('Class not found');
        return {
            ...classGroup,
            studentCount: classGroup.studentIds?.length || 0,
        };
    }
    async create(dto) {
        const institutionId = mongoose_2.Types.ObjectId.isValid(dto.institutionId || '')
            ? new mongoose_2.Types.ObjectId(dto.institutionId)
            : new mongoose_2.Types.ObjectId('000000000000000000000001');
        const mainTeacherId = dto.mainTeacherId && mongoose_2.Types.ObjectId.isValid(dto.mainTeacherId)
            ? new mongoose_2.Types.ObjectId(dto.mainTeacherId)
            : undefined;
        const studentIds = (dto.studentIds || [])
            .filter((id) => mongoose_2.Types.ObjectId.isValid(id))
            .map((id) => new mongoose_2.Types.ObjectId(id));
        const classGroup = await this.classModel.create({
            institutionId,
            name: dto.name,
            level: dto.level,
            academicYear: dto.academicYear,
            mainTeacherId,
            studentIds,
        });
        return { message: 'Class created', classGroup };
    }
    async update(id, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid class ID');
        const payload = { ...dto };
        if (dto.mainTeacherId !== undefined) {
            payload.mainTeacherId = mongoose_2.Types.ObjectId.isValid(dto.mainTeacherId)
                ? new mongoose_2.Types.ObjectId(dto.mainTeacherId)
                : null;
        }
        if (dto.studentIds !== undefined) {
            payload.studentIds = dto.studentIds
                .filter((studentId) => mongoose_2.Types.ObjectId.isValid(studentId))
                .map((studentId) => new mongoose_2.Types.ObjectId(studentId));
        }
        const classGroup = await this.classModel.findByIdAndUpdate(id, { $set: payload }, { new: true }).lean().exec();
        if (!classGroup)
            throw new common_1.NotFoundException('Class not found');
        return { message: 'Class updated', classGroup };
    }
    async delete(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid class ID');
        const classGroup = await this.classModel.findByIdAndDelete(id).lean().exec();
        if (!classGroup)
            throw new common_1.NotFoundException('Class not found');
        return { message: 'Class deleted', id };
    }
};
exports.ClassesService = ClassesService;
exports.ClassesService = ClassesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(class_group_schema_1.ClassGroup.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ClassesService);
//# sourceMappingURL=classes.service.js.map