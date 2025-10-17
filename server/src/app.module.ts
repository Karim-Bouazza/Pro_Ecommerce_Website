import { Module } from '@nestjs/common';
import { AdminsModule } from './admins/admins.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AdminsModule, UsersModule, AuthModule],
})
export class AppModule {}
