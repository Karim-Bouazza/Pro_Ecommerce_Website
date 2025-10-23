import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWTPayloadType } from 'src/utils/types';
import { EmailResetPasswordDto } from './dto/email.dto';
import { CreateResetPasswordCodeDto } from './dto/code.dto';
import { CreateResetPasswordDto } from './dto/password.dto';

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Send a password reset email
   * @param email User's email address
   * @returns Success message
   */
  async resetPasswordSendEmail(emailResetPasswordDto: EmailResetPasswordDto) {
    const { email } = emailResetPasswordDto;
    const userId = await this.prisma.user.findUnique({ where: { email } });
    if (!userId) throw new NotFoundException('User not found');

    const codeVerification = this.generateVerificationCode();
    const jwtVerificationCode = await this.generateJWT({
      id: userId.id,
      email: userId.email,
      role: userId.role,
      active: userId.active,
    });

    const user = await this.prisma.user.update({
      where: { email },
      data: { verificationCode: codeVerification },
    });

    const link = `http://localhost:5173/reset-password/verify-code?email=${user.email}&pes=${jwtVerificationCode}`;
    await this.mailService.sendEmail(
      { email: user.email },
      link,
      codeVerification,
    );

    return {
      message: 'Verification code sent to email, please check your inbox.',
    };
  }

  /**
   * Verify the password reset code
   * @param email User's email address
   * @param code Verification code
   * @returns Success message
   */
  async verifyCode(email: string, pes: string, createResetPasswordCodeDto: CreateResetPasswordCodeDto) {
    const { code } = createResetPasswordCodeDto;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    let payload;

    try {
      payload = await this.jwtService.verifyAsync(pes, {
        secret: process.env.JWT_SECRET,
      });
    } catch {
      throw new BadRequestException('Invalid verification code');
    }

    if (
      user.verificationCode !== code ||
      code === null ||
      payload.id !== user.id ||
      payload.id === null
    )
      throw new BadRequestException('Invalid verification code');

    return { message: 'Verification code is valid' };
  }

  /**
   *
   * @param email
   * @param newPassword
   * @param code
   * @param createdAt
   * @returns
   */
  async resetPassword(
    email: string,
    pes: string,
    createResetPasswordDto: CreateResetPasswordDto
  ) {
    const { code, password } = createResetPasswordDto;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    let payload;

    try {
      payload = await this.jwtService.verifyAsync(pes, {
        secret: process.env.JWT_SECRET,
      });
    } catch {
      throw new BadRequestException('Invalid verification code');
    }

    if (
      user.verificationCode !== code ||
      code === null ||
      payload.id !== user.id ||
      payload.id === null
    )
      throw new BadRequestException('Invalid verification code');

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword, verificationCode: null },
    });

    return { message: 'Password has been reset successfully' };
  }

  /**
   * Generate a verification code
   * @returns Verification code
   */
  generateVerificationCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  /**
   * Generate a JSON Web Token
   * @param payload JWT payload
   * @returns JWT token
   */
  private generateJWT(payload: JWTPayloadType) {
    return this.jwtService.signAsync(payload);
  }
}
