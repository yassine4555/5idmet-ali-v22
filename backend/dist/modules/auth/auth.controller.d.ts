import { AuthService } from './auth.service';
import { UserRole } from '../../schemas/user.schema';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(body: {
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
            id: import("mongoose").Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            role: UserRole;
            institutionId: import("mongoose").Types.ObjectId;
            avatarUrl: string;
        };
    }>;
    login(body: {
        email: string;
        password: string;
        role?: string;
    }): Promise<{
        message: string;
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
    getMe(userId: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        firstName: string;
        lastName: string;
        email: string;
        role: UserRole;
        institutionId: import("mongoose").Types.ObjectId;
        phone: string;
        status: string;
        avatarUrl: string;
    }>;
    parentSso(parentToken: string, body: {
        parentUserId: string;
        email: string;
    }): Promise<{
        accessToken: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            role: UserRole;
            institutionId: import("mongoose").Types.ObjectId;
        };
    }>;
}
