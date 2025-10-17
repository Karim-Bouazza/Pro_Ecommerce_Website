import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { UserRole } from "@prisma/client";
import { UsersService } from "src/users/users.service";

@Injectable()
export class RolesAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly reflector: Reflector, private readonly userService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: UserRole[] = this.reflector.getAllAndOverride('roles', [context.getHandler(), context.getClass()]);
    if (!roles || roles.length === 0) return false;


    const request: Request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') || [];
    
    if(type == 'Bearer' && token) {
        try {
          const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });

          const user = await this.userService.findCurrentUser(payload.id);
          if(!user) throw new UnauthorizedException('User no longer exists');

          if(roles.includes(user.role)) {
            request['user'] = payload;
            return true;
          }
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    } else {
        throw new UnauthorizedException('No token provided');
    }

    return false;
  }
}