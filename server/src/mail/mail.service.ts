import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * Send Notification Email
   * @param user Send Email To User
   */
  public async sendEmail(user: { email: string }, link: string, codeVerification: string) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: 'Karim Agency <nkb5u@inbox.testmail.app>',
        subject: 'Code Verification Reset Password',
        template: 'email',
        context: { email: user.email, link, codeVerification }
      });
      return { message: 'Email sent successfully' };
    } catch (error) {
      console.error('Error during email sending process:', error);
      throw new UnauthorizedException('Failed to send email notification.');
    }
  }
}
