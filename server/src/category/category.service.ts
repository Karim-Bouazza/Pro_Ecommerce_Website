import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create New Category From Admin
   * @param createCategoryDto name and image opionale
   * @returns status 200 & message & data
   */
  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;

    const category = await this.prisma.category.findUnique({ where: { name } });
    if (category)
      throw new HttpException(
        `You have already category with name: ${name}`,
        400,
      );

    const newCategory = await this.prisma.category.create({
      data: createCategoryDto,
    });
    return {
      status: 200,
      message: 'Category created successfully',
      data: newCategory,
    };
  }

  /**
   * Get all cateogries to users and admins
   * @returns All Categories
   */
  async findAll() {
    const categories = await this.prisma.category.findMany({
      omit: { createdAt: true, updatedAt: true },
      include: { subCategories: true },
    });

    return {
      status: 200,
      message: 'Categories found',
      data: categories,
    };
  }

  /**
   * get single category for users and admins
   * @param id of category
   * @returns data of category
   */
  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { subCategories: true },
      omit: { createdAt: true, updatedAt: true },
    });
    if (!category) throw new NotFoundException('Categery Not Found');

    return {
      status: 200,
      message: 'Category found',
      data: category,
    };
  }

  /**
   * Update Category By Admin
   * @param id of category
   * @param updateCategoryDto name & image Optional
   * @returns status 200 & message & updated category
   */
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException('Categery Not Found');

    const categoryUpdated = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });

    return {
      status: 200,
      message: 'Category updated successfully',
      data: categoryUpdated,
    };
  }

  /**
   * Delete Category By Admin
   * @param id of category
   * @returns status 200 & message
   */
  async remove(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException('Categery Not Found');

    await this.prisma.category.delete({
      where: { id },
    });

    return {
      status: 200,
      message: 'Categery deleted successfully',
    };
  }
}
