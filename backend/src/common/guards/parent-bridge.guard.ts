import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ParentBridgeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const parentAuthHeader = request.headers['x-parent-auth-token'] || request.headers['authorization'];

    if (!parentAuthHeader) {
      throw new UnauthorizedException('Parent Application authentication token missing');
    }

    // Pass parent token and inject parent identity metadata into context
    request.isParentDelegated = true;
    return true;
  }
}
