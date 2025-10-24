import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
     const { name } = createCategoryDto;
     const category = await this.prisma.category.findUnique({ where: { name } });
     if(category) throw new BadRequestException(`You have already category with name: ${name}`);

     const newCategory = await this.prisma.category.create({ data: { name } });

     return newCategory;

    //  ToDo : if he is enter image upload to cloudinary and then insert in db and insert name in db
  }

  findAll() {
    return this.prisma.category.findMany();
  }

  // findOne() {
  //   return this.prisma.category.findUnique({ where: { id } });
  // }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
