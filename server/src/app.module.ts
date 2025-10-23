import { Module } from '@nestjs/common';
import { AdminsModule } from './admins/admins.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ResetPasswordModule } from './reset_password/reset_password.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [AdminsModule, UsersModule, AuthModule, MailModule, ResetPasswordModule, CategoryModule],
})
export class AppModule {}
