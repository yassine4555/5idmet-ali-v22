import { Controller, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string; role?: string }) {
    return this.authService.login(body.email, body.password, body.role);
  }

  @Post('parent-sso')
  async parentSso(
    @Headers('x-parent-auth-token') parentToken: string,
    @Body() body: { parentUserId: string; email: string },
  ) {
    return this.authService.parentSsoLogin(parentToken, body.parentUserId, body.email);
  }
}
