import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User, UserRole } from '../../schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(dto: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: UserRole;
    phone?: string;
    institutionId?: string;
  }) {
    const emailLower = dto.email.trim().toLowerCase();
    const existingUser = await this.userModel.findOne({ email: emailLower }).exec();
    if (existingUser) {
      throw new BadRequestException('A user with this email address already exists');
    }

    if (!dto.password || dto.password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    const institutionId = dto.institutionId && Types.ObjectId.isValid(dto.institutionId)
      ? new Types.ObjectId(dto.institutionId)
      : new Types.ObjectId('000000000000000000000001');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const role = dto.role || UserRole.INSTITUTION_ADMIN;

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

  async login(email: string, pass: string, role?: string) {
    const emailLower = email.trim().toLowerCase();
    const user = await this.userModel.findOne({ email: emailLower }).select('+passwordHash').exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash || '');
    const allowDemo = this.configService.get<string>('ALLOW_DEMO_LOGIN') === 'true';
    if (!isMatch && !allowDemo) {
      throw new UnauthorizedException('Invalid credentials');
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

  async getProfile(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
    const user = await this.userModel.findById(userId).select('-passwordHash').lean().exec();
    if (!user) {
      throw new NotFoundException('User profile not found');
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

  async parentSsoLogin(parentToken: string, parentUserId: string, email: string) {
    let user = await this.userModel.findOne({ parentAppUserId: parentUserId }).exec();
    if (!user) {
      user = await this.userModel.create({
        parentAppUserId: parentUserId,
        email: email.trim().toLowerCase(),
        firstName: 'ParentUser',
        lastName: 'Integrated',
        passwordHash: 'SSO_DELEGATED',
        role: UserRole.PARENT,
        institutionId: new Types.ObjectId('000000000000000000000001'),
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
}
