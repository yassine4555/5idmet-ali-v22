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
const student_profile_schema_1 = require("../../schemas/student-profile.schema");
let ClassesService = class ClassesService {
    constructor(classModel, studentProfileModel) {
        this.classModel = classModel;
        this.studentProfileModel = studentProfileModel;
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
        const classes = await this.classModel
            .find(query)
            .populate('mainTeacherId', 'firstName lastName email')
            .lean()
            .exec();
        return classes.map((classGroup) => ({
            ...classGroup,
            studentCount: classGroup.studentIds?.length || 0,
        }));
    }
    async getById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid class ID');
        const classGroup = await this.classModel
            .findById(id)
            .populate('mainTeacherId', 'firstName lastName email')
            .lean()
            .exec();
        if (!classGroup)
            throw new common_1.NotFoundException('Class not found');
        const enrolledProfiles = await this.studentProfileModel
            .find({ currentClassId: classGroup._id })
            .populate('userId', 'firstName lastName email status')
            .lean()
            .exec();
        return {
            ...classGroup,
            studentCount: enrolledProfiles.length,
            students: enrolledProfiles.map((p) => ({
                profileId: p._id,
                userId: p.userId,
                registrationId: p.studentRegistrationId,
            })),
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
        if (studentIds.length > 0) {
            await this.studentProfileModel.updateMany({ userId: { $in: studentIds } }, { $set: { currentClassId: classGroup._id } }).exec();
        }
        return { message: 'Class created', classGroup };
    }
    async update(id, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid class ID');
        const payload = {};
        if (dto.name !== undefined)
            payload.name = dto.name;
        if (dto.level !== undefined)
            payload.level = dto.level;
        if (dto.academicYear !== undefined)
            payload.academicYear = dto.academicYear;
        if (dto.mainTeacherId !== undefined) {
            payload.mainTeacherId = mongoose_2.Types.ObjectId.isValid(dto.mainTeacherId)
                ? new mongoose_2.Types.ObjectId(dto.mainTeacherId)
                : null;
        }
        if (dto.studentIds !== undefined) {
            const newStudentIds = dto.studentIds
                .filter((sid) => mongoose_2.Types.ObjectId.isValid(sid))
                .map((sid) => new mongoose_2.Types.ObjectId(sid));
            payload.studentIds = newStudentIds;
            const existing = await this.classModel.findById(id).select('studentIds').lean().exec();
            const oldIds = (existing?.studentIds || []).map((sid) => sid.toString());
            const newIds = newStudentIds.map((sid) => sid.toString());
            const added = newIds.filter((sid) => !oldIds.includes(sid));
            const removed = oldIds.filter((sid) => !newIds.includes(sid));
            if (added.length > 0) {
                await this.studentProfileModel.updateMany({ userId: { $in: added.map((sid) => new mongoose_2.Types.ObjectId(sid)) } }, { $set: { currentClassId: new mongoose_2.Types.ObjectId(id) } }).exec();
            }
            if (removed.length > 0) {
                await this.studentProfileModel.updateMany({ userId: { $in: removed.map((sid) => new mongoose_2.Types.ObjectId(sid)) }, currentClassId: new mongoose_2.Types.ObjectId(id) }, { $unset: { currentClassId: '' } }).exec();
            }
        }
        const classGroup = await this.classModel.findByIdAndUpdate(id, { $set: payload }, { new: true })
            .populate('mainTeacherId', 'firstName lastName email')
            .lean()
            .exec();
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
        await this.studentProfileModel.updateMany({ currentClassId: new mongoose_2.Types.ObjectId(id) }, { $unset: { currentClassId: '' } }).exec();
        return { message: 'Class deleted', id };
    }
};
exports.ClassesService = ClassesService;
exports.ClassesService = ClassesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(class_group_schema_1.ClassGroup.name)),
    __param(1, (0, mongoose_1.InjectModel)(student_profile_schema_1.StudentProfile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ClassesService);
//# sourceMappingURL=classes.service.js.map