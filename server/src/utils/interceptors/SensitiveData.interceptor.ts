import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class SensitiveDataInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(map(data => {
        const { password, role, active, verificationCode, createdAt, updatedAt, ...resultat } = data.user;
        return { ...resultat };
    }))
  }
}
