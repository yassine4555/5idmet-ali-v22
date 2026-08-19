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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_1 = require("@nestjs/config");
const user_schema_1 = require("../../schemas/user.schema");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(userModel, jwtService, configService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async signup(dto) {
        const emailLower = dto.email.trim().toLowerCase();
        const existingUser = await this.userModel.findOne({ email: emailLower }).exec();
        if (existingUser) {
            throw new common_1.BadRequestException('A user with this email address already exists');
        }
        if (!dto.password || dto.password.length < 6) {
            throw new common_1.BadRequestException('Password must be at least 6 characters long');
        }
        const institutionId = dto.institutionId && mongoose_2.Types.ObjectId.isValid(dto.institutionId)
            ? new mongoose_2.Types.ObjectId(dto.institutionId)
            : new mongoose_2.Types.ObjectId('000000000000000000000001');
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const role = dto.role || user_schema_1.UserRole.INSTITUTION_ADMIN;
        const user = await this.userModel.create({
            institutionId,
            firstName: dto.firstName.trim(),
            lastName: dto.lastName.trim(),
            email: emailLower,
            passwordHash,
            role,
            phone: dto.phone,
            status: 'ACTIVE',
        });
        const payload = { sub: user._id, email: user.email, role: user.role, institutionId: user.institutionId };
        const accessToken = this.jwtService.sign(payload);
        return {
            message: 'Account created successfully',
            accessToken,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                institutionId: user.institutionId,
                avatarUrl: user.avatarUrl,
            },
        };
    }
    async login(email, pass, role) {
        const emailLower = email.trim().toLowerCase();
        const user = await this.userModel.findOne({ email: emailLower }).select('+passwordHash').exec();
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(pass, user.passwordHash || '');
        const allowDemo = this.configService.get('ALLOW_DEMO_LOGIN') === 'true';
        if (!isMatch && !allowDemo) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user._id, email: user.email, role: user.role, institutionId: user.institutionId };
        return {
            message: 'Logged in successfully',
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                institutionId: user.institutionId,
                avatarUrl: user.avatarUrl,
            },
        };
    }
    async getProfile(userId) {
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new common_1.BadRequestException('Invalid user ID');
        }
        const user = await this.userModel.findById(userId).select('-passwordHash').lean().exec();
        if (!user) {
            throw new common_1.NotFoundException('User profile not found');
        }
        return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            institutionId: user.institutionId,
            phone: user.phone,
            status: user.status,
            avatarUrl: user.avatarUrl,
        };
    }
    async parentSsoLogin(parentToken, parentUserId, email) {
        let user = await this.userModel.findOne({ parentAppUserId: parentUserId }).exec();
        if (!user) {
            user = await this.userModel.create({
                parentAppUserId: parentUserId,
                email: email.trim().toLowerCase(),
                firstName: 'ParentUser',
                lastName: 'Integrated',
                passwordHash: 'SSO_DELEGATED',
                role: user_schema_1.UserRole.PARENT,
                institutionId: new mongoose_2.Types.ObjectId('000000000000000000000001'),
            });
        }
        const payload = { sub: user._id, email: user.email, role: user.role, institutionId: user.institutionId, isParentSSO: true };
        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                institutionId: user.institutionId,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map