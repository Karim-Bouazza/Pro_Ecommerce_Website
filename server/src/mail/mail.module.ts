import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          transport: {
            host: config.get<string>('MAIL_HOST'),
            port: config.get<number>('MAIL_PORT'),
            secure: false,
            auth: {
              user: config.get<string>('MAIL_USER'),
              pass: config.get<string>('MAIL_PASSWORD'),
            },
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new EjsAdapter({
              inlineCssEnabled: true,
            }),
          },
        };
      },
    }),
  ],
})
export class MailModule {}
