import { Controller, Post, Get, Body, Headers, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserRole } from '../../schemas/user.schema';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      role?: UserRole;
      phone?: string;
      institutionId?: string;
    },
  ) {
    return this.authService.signup(body);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string; role?: string }) {
    return this.authService.login(body.email, body.password, body.role);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }

  @Public()
  @Post('parent-sso')
  @HttpCode(HttpStatus.OK)
  async parentSso(
    @Headers('x-parent-auth-token') parentToken: string,
    @Body() body: { parentUserId: string; email: string },
  ) {
    return this.authService.parentSsoLogin(parentToken, body.parentUserId, body.email);
  }
}
