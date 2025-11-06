import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTexDto } from './dto/create-tex.dto';
import { UpdateTexDto } from './dto/update-tex.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TexService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * create tex by admin
   * @param createTexDto texName & texPrice is optional
   * @returns status & message & data
   */
  async create(createTexDto: CreateTexDto) {
    const { texName } = createTexDto;
    const tex = await this.prisma.tex.findFirst({ where: { texName } });
    if (tex)
      throw new HttpException(
        `You have already tex with name: ${texName}`,
        400,
      );

    const newTex = await this.prisma.tex.create({ data: createTexDto });
    return {
      status: 200,
      message: 'Tex created successfully',
      data: newTex,
    };
  }

  /**
   * All tex by admin
   * @returns status & message & data
   */
  async findAll() {
    const tex = await this.prisma.tex.findMany();
    return {
      status: 200,
      message: 'Tex found',
      data: tex,
    };
  }

  /**
   * find tex by admin
   * @param id of tex
   * @returns status & message & data
   */
  async findOne(id: number) {
    const tex = await this.prisma.tex.findUnique({ where: { id } });
    if (!tex) throw new NotFoundException(`Tex Not Found`);

    return {
      status: 200,
      message: 'Tex found',
      data: tex,
    };
  }

  /**
   * update tex by admin
   * @param id of tex
   * @param  updateTexDtoname texName & texPrice
   * @returns status & message & data
   */
  async update(id: number, updateTexDto: UpdateTexDto) {
    const tex = await this.prisma.tex.findUnique({
      where: { id },
    });
    if (!tex) throw new NotFoundException(`Tex Not Found`);

    if (updateTexDto.texName) {
      const texWithName = await this.prisma.tex.findFirst({
        where: { texName: updateTexDto.texName },
      });
      if (texWithName && texWithName.id !== id) {
        throw new HttpException(
          `You have already tex with name: ${updateTexDto.texName}`,
          400,
        );
      }
    }

    const texUpdated = await this.prisma.tex.update({
      where: { id },
      data: updateTexDto,
    });

    return {
      status: 200,
      message: 'Tex updated successfully',
      data: texUpdated,
    };
  }

  /**
   * delete tex by admin
   * @param id of tex
   * @returns status & message
   */
  async remove(id: number) {
    const tex = await this.prisma.tex.findUnique({
      where: { id },
    });
    if (!tex) throw new NotFoundException(`Tex Not Found`);

    await this.prisma.tex.delete({
      where: { id },
    });

    return {
      status: 200,
      message: `Tex deleted successfully`,
    };
  }
}
