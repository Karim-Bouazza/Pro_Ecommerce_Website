import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get user by ID
   * @param id - User ID
   * @returns User object (without sensitive fields)
   * @throws NotFoundException if user doesn't exist
   */
  async findCurrentUser(id: number) {
    const userInfo = await this.prisma.user.findUnique({ where: { id } });
    if (!userInfo) throw new NotFoundException('User not found');
    const {
      password,
      active,
      verificationCode,
      createdAt,
      updatedAt,
      ...user
    } = userInfo;
    return user;
  }

  /**
   * Update user by ID
   * @param id - User ID
   * @param updateUserDto - Fields to update
   * @returns Updated user object (without sensitive fields)
   * @throws NotFoundException if user doesn't exist
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const userUpdated = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
      const {
        password,
        active,
        verificationCode,
        createdAt,
        updatedAt,
        ...user
      } = userUpdated;
      return user;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  /**
   * Delete user by ID
   * @param id - User ID
   * @returns Deleted user object
   * @throws NotFoundException if user doesn't exist
   */
  async remove(id: number) {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param id - User ID
   * @returns User object (without sensitive fields)
   * @throws NotFoundException if user doesn't exist
   */
  async findUserByOtherUser(id: number) {
    const userInfo = await this.prisma.user.findUnique({ where: { id } });
    if (!userInfo) throw new NotFoundException('User not found');
    const {
      password,
      role,
      email,
      active,
      verificationCode,
      createdAt,
      updatedAt,
      ...user
    } = userInfo;
    return user;
  }
}
