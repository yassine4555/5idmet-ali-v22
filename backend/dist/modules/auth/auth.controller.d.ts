import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        email: string;
        password: string;
        role?: string;
    }): Promise<{
        accessToken: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            role: import("../../schemas/user.schema").UserRole;
            institutionId: import("mongoose").Types.ObjectId;
            avatarUrl: string;
        };
    }>;
    parentSso(parentToken: string, body: {
        parentUserId: string;
        email: string;
    }): Promise<{
        accessToken: string;
        user: import("mongoose").Document<unknown, {}, import("../../schemas/user.schema").User, {}, {}> & import("../../schemas/user.schema").User & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
}
