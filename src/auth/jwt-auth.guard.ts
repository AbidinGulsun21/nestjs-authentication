import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const parentCanActivate = (await super.canActivate(context)) as boolean;
    if (!parentCanActivate) return false;

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (roles && roles.length > 0) {
      let hasARole = false;
      for (const role of roles) {
        if (user.roles.includes(role)) {
          hasARole = true;
        }
      }
      return hasARole;
    }

    // if (!user.active) {
    //   return false;
    // }

    return true;
  }

}
