import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class SubCategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService,
  ) {}

  /**
   * Create Sub-Category By Admin
   * @param createSubCategoryDto name & image opional
   * @returns status 200 & message & data
   */
  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const { name, categoryId } = createSubCategoryDto;
    await this.categoryService.findOne(categoryId);

    const subCategory = await this.prisma.subCategory.findUnique({
      where: { name },
    });

    if (subCategory)
      throw new HttpException(
        `You have already subCategory with name: ${name}`,
        400,
      );

    const newSubCategory = await this.prisma.subCategory.create({
      data: createSubCategoryDto,
    });
    return {
      status: 200,
      message: 'Sub-Category created successfully',
      data: newSubCategory,
    };
  }

  /**
   * All Sub-Categories By Admin and Users
   * @returns status 200 & message & data
   */
  async findAll() {
    const subCategories = await this.prisma.subCategory.findMany({
      include: { category: true },
      omit: { createdAt: true, updatedAt: true },
    });

    return {
      status: 200,
      message: 'Sub-Categories found',
      data: subCategories,
    };
  }

  /**
   * sub-category by admin and users
   * @param id of sub-category
   * @returns status 200 & message & data
   */
  async findOne(id: number) {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!subCategory) throw new NotFoundException(`Sub-Category Not Found`);

    return {
      status: 200,
      message: 'Sub-Category found',
      data: subCategory,
    };
  }

  /**
   * update sub-category by admin
   * @param id of sub-category
   * @param updateSubCategoryDto name & image
   * @returns status & message & data
   */
  async update(id: number, updateSubCategoryDto: UpdateSubCategoryDto) {
    if (updateSubCategoryDto.categoryId) {
      await this.categoryService.findOne(updateSubCategoryDto.categoryId);
    }

    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id },
    });
    if (!subCategory) throw new NotFoundException(`Sub-Category Not Found`);

    const subCategoryUpdated = await this.prisma.subCategory.update({
      where: { id },
      data: updateSubCategoryDto,
    });

    return {
      status: 200,
      message: 'Sub-Category updated successfully',
      data: subCategoryUpdated,
    };
  }

  /**
   * delete sub-category by admin
   * @param id of sub-category
   * @returns status & messae
   */
  async remove(id: number) {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id },
    });
    if (!subCategory) throw new NotFoundException(`Sub-Category Not Found`);

    await this.prisma.subCategory.delete({
      where: { id },
    });

    return {
      status: 200,
      message: `SubCategory deleted successfully`,
    };
  }
}
