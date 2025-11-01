import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JWTPayloadType } from 'src/utils/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   * @param registerUserDto
   * @returns User Data and Token
   */
  async register(registerUserDto: RegisterDto) {
    const { name, email } = registerUserDto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) throw new NotFoundException('User already exists');

    const passwordHash = await bcrypt.hash(registerUserDto.password, 10);

    const newUser = await this.prisma.user.create({
      data: { name, email, password: passwordHash },
    });
    const {
      password,
      role,
      active,
      verificationCode,
      createdAt,
      updatedAt,
      ...resultat
    } = newUser;


    const accessToken = await this.generateJWT({ id: newUser.id, email: newUser.email, role: newUser.role, active: newUser.active });

    return {
      message: 'User registered successfully',
      user: resultat,
      accessToken,
    };
  }

  /**
   * Login a user
   * @param loginUserDto
   * @returns User Data and Token
   */
  async login(loginUserDto: LoginDto) {
    const { email } = loginUserDto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    const {
      password,
      role,
      active,
      verificationCode,
      createdAt,
      updatedAt,
      ...resultat
    } = user;

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid email or password');

    const accessToken = await this.generateJWT({ id: user.id, email: user.email, role: user.role, active: user.active });

    return { message: 'Login successful', user: resultat, accessToken };
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
