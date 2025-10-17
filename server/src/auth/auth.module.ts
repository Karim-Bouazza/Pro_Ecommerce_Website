import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, PrismaModule, JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
  })],
  exports: [],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
