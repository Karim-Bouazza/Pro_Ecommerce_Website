import { Module } from '@nestjs/common';
import { TexService } from './tex.service';
import { TexController } from './tex.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [TexController],
  providers: [TexService],
})
export class TexModule {}
