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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const student_profile_schema_1 = require("../../schemas/student-profile.schema");
const user_schema_1 = require("../../schemas/user.schema");
const class_group_schema_1 = require("../../schemas/class-group.schema");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
let StudentsService = class StudentsService {
    constructor(studentProfileModel, userModel, classGroupModel, configService) {
        this.studentProfileModel = studentProfileModel;
        this.userModel = userModel;
        this.classGroupModel = classGroupModel;
        this.configService = configService;
    }
    async findAll(query) {
        const filter = { role: user_schema_1.UserRole.STUDENT };
        if (query.status && query.status !== 'ALL')
            filter.status = query.status;
        let users = await this.userModel.find(filter).select('-passwordHash').lean().exec();
        if (query.search) {
            const term = query.search.toLowerCase();
            users = users.filter((u) => u.firstName.toLowerCase().includes(term) ||
                u.lastName.toLowerCase().includes(term) ||
                u.email.toLowerCase().includes(term));
        }
        const userIds = users.map((u) => u._id);
        const profiles = await this.studentProfileModel.find({ userId: { $in: userIds } }).lean().exec();
        const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));
        return users.map((u) => {
            const p = profileMap.get(u._id.toString());
            if (query.classId && mongoose_2.Types.ObjectId.isValid(query.classId)) {
                if (!p?.currentClassId || p.currentClassId.toString() !== query.classId)
                    return null;
            }
            const gradeLevel = p?.academicInfo?.currentGradeLevel || 'Non assigné';
            const matchesLevel = !query.level || gradeLevel.includes(query.level);
            if (!matchesLevel)
                return null;
            return {
                id: u._id,
                firstName: u.firstName,
                lastName: u.lastName,
                email: u.email,
                phone: u.phone,
                status: u.status,
                avatarUrl: u.avatarUrl,
                registrationId: p?.studentRegistrationId || `EDU-${u._id.toString().slice(-6).toUpperCase()}`,
                currentGradeLevel: gradeLevel,
                currentClassId: p?.currentClassId || null,
                gpa: p?.academicInfo?.currentGPA || 0,
                paymentStatus: p?.financialInfo?.accountBalance != null && p.financialInfo.accountBalance < 0 ? 'OVERDUE' : 'PAID',
            };
        }).filter(Boolean);
    }
    async getProfile(userId) {
        if (!mongoose_2.Types.ObjectId.isValid(userId))
            throw new common_1.BadRequestException('Invalid student ID');
        const user = await this.userModel.findById(userId).select('-passwordHash').lean().exec();
        if (!user)
            throw new common_1.NotFoundException('Student not found');
        const profile = await this.studentProfileModel.findOne({ userId: user._id }).lean().exec();
        return {
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                avatarUrl: user.avatarUrl,
                status: user.status,
            },
            profile: profile || null,
        };
    }
    async createStudent(dto) {
        const existing = await this.userModel.findOne({ email: dto.email.toLowerCase() }).exec();
        if (existing)
            throw new common_1.BadRequestException('A user with this email already exists');
        const institutionId = mongoose_2.Types.ObjectId.isValid(dto.institutionId)
            ? new mongoose_2.Types.ObjectId(dto.institutionId)
            : new mongoose_2.Types.ObjectId('000000000000000000000001');
        const configuredDefault = this.configService.get('NEW_USER_DEFAULT_PASSWORD');
        const plainPassword = configuredDefault || crypto.randomBytes(6).toString('hex');
        const passwordHash = await bcrypt.hash(plainPassword, 10);
        const user = await this.userModel.create({
            institutionId,
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email.toLowerCase(),
            passwordHash,
            role: user_schema_1.UserRole.STUDENT,
            phone: dto.phone,
            status: 'ACTIVE',
        });
        const regId = `EDU-${new Date().getFullYear()}-${user._id.toString().slice(-4).toUpperCase()}`;
        const profile = await this.studentProfileModel.create({
            userId: user._id,
            institutionId,
            studentRegistrationId: regId,
            personalInfo: dto.personalInfo || {},
            academicInfo: dto.academicInfo || { currentGradeLevel: 'Non assigné', currentGPA: 0 },
            medicalInfo: dto.medicalInfo || {},
            financialInfo: dto.financialInfo || { accountBalance: 0, paymentPlan: 'TRIMESTRIAL' },
        });
        return {
            message: 'Student enrolled successfully',
            tempPassword: plainPassword,
            user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, status: user.status },
            profile: { id: profile._id, registrationId: regId },
        };
    }
    async updateStudent(userId, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(userId))
            throw new common_1.BadRequestException('Invalid student ID');
        const userUpdate = {};
        if (dto.firstName)
            userUpdate.firstName = dto.firstName;
        if (dto.lastName)
            userUpdate.lastName = dto.lastName;
        if (dto.phone)
            userUpdate.phone = dto.phone;
        if (dto.status)
            userUpdate.status = dto.status;
        const user = await this.userModel.findByIdAndUpdate(userId, { $set: userUpdate }, { new: true }).select('-passwordHash').lean().exec();
        if (!user)
            throw new common_1.NotFoundException('Student not found');
        const profileUpdate = {};
        if (dto.personalInfo)
            profileUpdate.personalInfo = dto.personalInfo;
        if (dto.academicInfo)
            profileUpdate.academicInfo = dto.academicInfo;
        if (dto.medicalInfo)
            profileUpdate.medicalInfo = dto.medicalInfo;
        if (dto.financialInfo)
            profileUpdate.financialInfo = dto.financialInfo;
        if (dto.currentClassId !== undefined) {
            const oldProfile = await this.studentProfileModel.findOne({ userId }).select('currentClassId').lean().exec();
            const oldClassId = oldProfile?.currentClassId?.toString();
            const newClassId = dto.currentClassId && mongoose_2.Types.ObjectId.isValid(dto.currentClassId) ? dto.currentClassId : null;
            if (oldClassId && oldClassId !== newClassId) {
                await this.classGroupModel.findByIdAndUpdate(oldClassId, {
                    $pull: { studentIds: new mongoose_2.Types.ObjectId(userId) },
                }).exec();
            }
            if (newClassId) {
                profileUpdate.currentClassId = new mongoose_2.Types.ObjectId(newClassId);
                await this.classGroupModel.findByIdAndUpdate(newClassId, {
                    $addToSet: { studentIds: new mongoose_2.Types.ObjectId(userId) },
                }).exec();
            }
            else {
                profileUpdate.currentClassId = null;
            }
        }
        const profile = await this.studentProfileModel.findOneAndUpdate({ userId }, { $set: profileUpdate }, { new: true, upsert: true }).lean().exec();
        return { message: 'Student updated successfully', user, profile };
    }
    async deleteStudent(userId) {
        if (!mongoose_2.Types.ObjectId.isValid(userId))
            throw new common_1.BadRequestException('Invalid student ID');
        const profile = await this.studentProfileModel.findOne({ userId }).select('currentClassId').lean().exec();
        const user = await this.userModel.findByIdAndDelete(userId).exec();
        if (!user)
            throw new common_1.NotFoundException('Student not found');
        await this.studentProfileModel.findOneAndDelete({ userId }).exec();
        if (profile?.currentClassId) {
            await this.classGroupModel.findByIdAndUpdate(profile.currentClassId, {
                $pull: { studentIds: new mongoose_2.Types.ObjectId(userId) },
            }).exec();
        }
        return { message: `Student ${user.firstName} ${user.lastName} deleted successfully` };
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(student_profile_schema_1.StudentProfile.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(class_group_schema_1.ClassGroup.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        config_1.ConfigService])
], StudentsService);
//# sourceMappingURL=students.service.js.map