import { ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Display Current Admin
   * @param id
   * @returns Current Admin
   */
  async findAdmin(id: number) {
    const admin = this.prisma.user.findUnique({ where: { id }});
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  /**
   * Create User with access to set the Role
   * @param createUserDto
   * @returns
   */
  async create(createUserDto: CreateAdminDto) {
    const { email } = createUserDto;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) throw new HttpException('User already exists', 400);

    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email,
        password: passwordHash,
        role: createUserDto.role,
      },
    });
    const { password, createdAt, updatedAt, ...resultat } = newUser;

    return { message: 'Admin created successfully', user: resultat };
  }

  /**
   * Get all users By Admin
   * @returns Array of users (without password)
   */
  findAll(pageNumber: number, userPerPage: number, usersName?: string, usersOrder?: string, usersRole?: UserRole) {
    return this.prisma.user.findMany({
      skip: (pageNumber - 1) * userPerPage,
      take: userPerPage,
      orderBy: { name: usersOrder === 'desc' ? 'desc' : 'asc' },
      where: { name: { contains: usersName, mode: 'insensitive' }, role: usersRole },
      omit: { password: true },
    });
  }

  /**
   * Get User By Id By Admin
   * @param id
   * @returns User By Id
   */
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Update User By Admin
   * @param id
   * @param updateUserDto
   * @returns Updated User
   */
  async update(id: number, updateUserDto: UpdateAdminDto) {
    const { email } = updateUserDto;
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (updateUserDto.password) {
      const passwordHash = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = passwordHash;
    }
    if (updateUserDto.email) {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if(user) throw new ConflictException("Email already exist"); 
    }
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      omit: { password: true }
    });
  }

  /**
   * Delete User By Admin
   * @param id
   * @returns Message
   */
  async remove(id: number) {
    const user = this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}
