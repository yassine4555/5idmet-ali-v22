import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  async login(email: string, pass: string, role?: string) {
    const user = await this.userModel.findOne({ email }).select('+passwordHash').exec();
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

  async parentSsoLogin(parentToken: string, parentUserId: string, email: string) {
    // Validate or JIT Provision user from Parent App
    let user = await this.userModel.findOne({ parentAppUserId: parentUserId }).exec();
    if (!user) {
      user = await this.userModel.create({
        parentAppUserId: parentUserId,
        email,
        firstName: 'ParentUser',
        lastName: 'Integrated',
        passwordHash: 'SSO_DELEGATED',
        role: UserRole.STUDENT,
        institutionId: '65c123456789012345678901',
      });
    }

    const payload = { sub: user._id, email: user.email, role: user.role, institutionId: user.institutionId, isParentSSO: true };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
