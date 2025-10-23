import { Body, Controller, Post, Query } from '@nestjs/common';
import { ResetPasswordService } from './reset_password.service';
import { EmailResetPasswordDto } from './dto/email.dto';
import { CreateResetPasswordCodeDto } from './dto/code.dto';
import { CreateResetPasswordDto } from './dto/password.dto';

@Controller('reset-password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  // ~/reset-password/send-email
  @Post('send-email')
  forgotPassword(@Body() emailResetPasswordDto: EmailResetPasswordDto) {
    return this.resetPasswordService.resetPasswordSendEmail(emailResetPasswordDto);
  }

  // ~/reset-password/verify-code/:email/:pes
  @Post('verify-code')
  verifyCode(
    @Query('email') email: string,
    @Query('pes') pes: string,
    @Body() createResetPasswordCodeDto: CreateResetPasswordCodeDto,
  ) {
    return this.resetPasswordService.verifyCode(email, pes, createResetPasswordCodeDto);
  }

  // ~/reset-password/reset/:email/:pes
  @Post('reset')
  resetPassword(
    @Query('email') email: string,
    @Query('pes') pes: string,
    @Body() createResetPasswordDto: CreateResetPasswordDto,
  ) {
    return this.resetPasswordService.resetPassword(email, pes, createResetPasswordDto);
  }
}
