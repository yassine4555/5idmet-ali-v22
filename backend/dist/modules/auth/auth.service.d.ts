import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User, UserRole } from '../../schemas/user.schema';
export declare class AuthService {
    private userModel;
    private jwtService;
    private configService;
    constructor(userModel: Model<User>, jwtService: JwtService, configService: ConfigService);
    signup(dto: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role?: UserRole;
        phone?: string;
        institutionId?: string;
    }): Promise<{
        message: string;
        accessToken: string;
        user: {
            id: Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            role: UserRole;
            institutionId: Types.ObjectId;
            avatarUrl: string;
        };
    }>;
    login(email: string, pass: string, role?: string): Promise<{
        message: string;
        accessToken: string;
        user: {
            id: Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            role: UserRole;
            institutionId: Types.ObjectId;
            avatarUrl: string;
        };
    }>;
    getProfile(userId: string): Promise<{
        id: Types.ObjectId;
        firstName: string;
        lastName: string;
        email: string;
        role: UserRole;
        institutionId: Types.ObjectId;
        phone: string;
        status: string;
        avatarUrl: string;
    }>;
    parentSsoLogin(parentToken: string, parentUserId: string, email: string): Promise<{
        accessToken: string;
        user: {
            id: Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            role: UserRole;
            institutionId: Types.ObjectId;
        };
    }>;
}
