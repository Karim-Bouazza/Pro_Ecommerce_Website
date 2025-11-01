import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * create brand by admin
   * @param createBrandDto name & image opional
   * @returns status & message & data
   */
  async create(createBrandDto: CreateBrandDto) {
    const { name } = createBrandDto;
    const brand = await this.prisma.brand.findFirst({ where: { name } });
    if (brand)
      throw new HttpException(`You have already brand with name: ${name}`, 400);

    const newBrand = await this.prisma.brand.create({ data: createBrandDto });
    return {
      status: 200,
      message: 'Brand created successfully',
      data: newBrand,
    };
  }

  /**
   * All brands by admin
   * @returns status & message & data
   */
  async findAll() {
    const brands = await this.prisma.brand.findMany({
      omit: { createdAt: true, updatedAt: true },
    });
    return {
      status: 200,
      message: 'Brands found',
      data: brands,
    };
  }

  /**
   * find brand by admin
   * @param id of brand
   * @returns status & message & data
   */
  async findOne(id: number) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException(`Brand Not Found`);

    return {
      status: 200,
      message: 'Brand found',
      data: brand,
    };
  }

  /**
   * update brand by admin
   * @param id of brand
   * @param updateBrandDto name & image
   * @returns status & message & data
   */
  async update(id: number, updateBrandDto: UpdateBrandDto) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    });
    if (!brand) throw new NotFoundException(`Brand Not Found`);

    if (updateBrandDto.name) {
      const brandWithName = await this.prisma.brand.findFirst({
        where: { name: updateBrandDto.name },
      });
      if (brandWithName && brandWithName.id !== id) {
        throw new HttpException(
          `You have already brand with name: ${updateBrandDto.name}`,
          400,
        );
      }
    }

    const brandUpdated = await this.prisma.brand.update({
      where: { id },
      data: updateBrandDto,
    });

    return {
      status: 200,
      message: 'Brand updated successfully',
      data: brandUpdated,
    };
  }

  /**
   * delete brand by admin
   * @param id of brand
   * @returns status & message
   */
  async remove(id: number) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    });
    if (!brand) throw new NotFoundException(`Brand Not Found`);

    await this.prisma.brand.delete({
      where: { id },
    });

    return {
      status: 200,
      message: `Brand deleted successfully`,
    };
  }
}
