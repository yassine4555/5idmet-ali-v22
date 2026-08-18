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
exports.TeachersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../schemas/user.schema");
const teacher_profile_schema_1 = require("../../schemas/teacher-profile.schema");
let TeachersService = class TeachersService {
    constructor(userModel, teacherProfileModel) {
        this.userModel = userModel;
        this.teacherProfileModel = teacherProfileModel;
    }
    async findAll(query) {
        const filter = { role: user_schema_1.UserRole.TEACHER };
        let users = await this.userModel.find(filter).select('-passwordHash').lean().exec();
        if (query.search) {
            const term = query.search.toLowerCase();
            users = users.filter((u) => u.firstName.toLowerCase().includes(term) || u.lastName.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
        }
        const userIds = users.map((u) => u._id);
        const profiles = await this.teacherProfileModel.find({ userId: { $in: userIds } }).lean().exec();
        const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));
        return users.map((u) => ({
            id: u._id,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            phone: u.phone,
            avatarUrl: u.avatarUrl,
            profile: profileMap.get(u._id.toString()) || null,
        }));
    }
    async getById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid teacher ID');
        const user = await this.userModel.findById(id).select('-passwordHash').lean().exec();
        if (!user)
            throw new common_1.NotFoundException('Teacher not found');
        const profile = await this.teacherProfileModel.findOne({ userId: user._id }).lean().exec();
        return { user, profile };
    }
    async createTeacher(dto) {
        const existing = await this.userModel.findOne({ email: dto.email.toLowerCase() }).exec();
        if (existing)
            throw new common_1.BadRequestException('A user with this email already exists');
        const institutionId = mongoose_2.Types.ObjectId.isValid(dto.institutionId) ? new mongoose_2.Types.ObjectId(dto.institutionId) : new mongoose_2.Types.ObjectId('000000000000000000000001');
        const user = await this.userModel.create({
            institutionId,
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email.toLowerCase(),
            passwordHash: 'REPLACE_ME',
            role: user_schema_1.UserRole.TEACHER,
            phone: dto.phone,
            status: 'ACTIVE',
        });
        const profile = await this.teacherProfileModel.create({
            userId: user._id,
            institutionId,
            employeeNumber: `T-${new Date().getFullYear()}-${user._id.toString().slice(-4).toUpperCase()}`,
            professionalInfo: dto.professionalInfo || {},
            personalInfo: dto.personalInfo || {},
        });
        return { message: 'Teacher created', user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email }, profile };
    }
    async updateTeacher(id, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid teacher ID');
        const userUpdate = {};
        if (dto.firstName)
            userUpdate.firstName = dto.firstName;
        if (dto.lastName)
            userUpdate.lastName = dto.lastName;
        if (dto.phone)
            userUpdate.phone = dto.phone;
        if (dto.status)
            userUpdate.status = dto.status;
        const user = await this.userModel.findByIdAndUpdate(id, { $set: userUpdate }, { new: true }).select('-passwordHash').lean().exec();
        if (!user)
            throw new common_1.NotFoundException('Teacher not found');
        const profileUpdate = {};
        if (dto.personalInfo)
            profileUpdate.personalInfo = dto.personalInfo;
        if (dto.professionalInfo)
            profileUpdate.professionalInfo = dto.professionalInfo;
        const profile = await this.teacherProfileModel.findOneAndUpdate({ userId: id }, { $set: profileUpdate }, { new: true, upsert: true }).lean().exec();
        return { message: 'Teacher updated', user, profile };
    }
    async deleteTeacher(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid teacher ID');
        const user = await this.userModel.findByIdAndDelete(id).exec();
        if (!user)
            throw new common_1.NotFoundException('Teacher not found');
        await this.teacherProfileModel.findOneAndDelete({ userId: id }).exec();
        return { message: `Teacher ${user.firstName} ${user.lastName} deleted` };
    }
};
exports.TeachersService = TeachersService;
exports.TeachersService = TeachersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(teacher_profile_schema_1.TeacherProfile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], TeachersService);
//# sourceMappingURL=teachers.service.js.map