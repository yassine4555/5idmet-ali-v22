import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User, UserRole } from '../../schemas/user.schema';
export declare class AuthService {
    private userModel;
    private jwtService;
    private configService;
    constructor(userModel: Model<User>, jwtService: JwtService, configService: ConfigService);
    login(email: string, pass: string, role?: string): Promise<{
        accessToken: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            role: UserRole;
            institutionId: import("mongoose").Types.ObjectId;
            avatarUrl: string;
        };
    }>;
    parentSsoLogin(parentToken: string, parentUserId: string, email: string): Promise<{
        accessToken: string;
        user: import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
}
