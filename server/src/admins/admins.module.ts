import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  exports: [],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
