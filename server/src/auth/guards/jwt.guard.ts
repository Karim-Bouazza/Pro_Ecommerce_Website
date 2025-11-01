import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') || [];
    
    if(type == 'Bearer' && token) {
        try {
          const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
          request['user'] = payload;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    } else {
        throw new UnauthorizedException('No token provided');
    }

    return true;
  }
}