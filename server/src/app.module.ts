import { Module } from '@nestjs/common';
import { AdminsModule } from './admins/admins.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [AdminsModule, UsersModule, AuthModule, MailModule],
})
export class AppModule {}
