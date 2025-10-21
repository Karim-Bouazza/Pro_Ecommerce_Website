import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('sendMail')
  sendMail(@Body() user: { email: string }, link: string, codeVerification: string) {
    return this.mailService.sendEmail(user, link, codeVerification);
  }
}
