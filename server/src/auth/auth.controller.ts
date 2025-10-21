import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ~/auth/register
  @Post('register')
  register(@Body() createAuthDto: RegisterDto) {
    return this.authService.register(createAuthDto);
  }

  // ~/auth/login
  @Post('login')
  login(@Body() loginAuthDto: LoginDto) {
    return this.authService.login(loginAuthDto);
  }

  // ~/auth/forgot-password
  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.authService.resetPasswordEmail(email);
  }
}

