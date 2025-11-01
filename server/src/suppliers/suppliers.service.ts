import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * create supplier by admin
   * @param CreateSupplierDto name & website
   * @returns status & message & data
   */
  async create(createSupplierDto: CreateSupplierDto) {
    const { name } = CreateSupplierDto;
    const supplier = await this.prisma.suppliers.findFirst({ where: { name } });
    if (supplier)
      throw new HttpException(
        `You have already supplier with name: ${name}`,
        400,
      );

    const newSupplier = await this.prisma.suppliers.create({
      data: createSupplierDto,
    });
    return {
      status: 200,
      message: 'Supplier created successfully',
      data: newSupplier,
    };
  }

  /**
   * All suppliers by admin
   * @returns status & message & data
   */
  async findAll() {
    const suppliers = await this.prisma.suppliers.findMany({
      omit: { createdAt: true, updatedAt: true },
    });
    return {
      status: 200,
      message: 'Suppliers found',
      data: suppliers,
    };
  }

  /**
   * find supplier by admin
   * @param id of supplier
   * @returns status & message & data
   */
  async findOne(id: number) {
    const supplier = await this.prisma.suppliers.findUnique({ where: { id } });
    if (!supplier) throw new NotFoundException(`Supplier Not Found`);

    return {
      status: 200,
      message: 'Supplier found',
      data: supplier,
    };
  }

  /**
   * update supplier by admin
   * @param id of supplier
   * @param UpdateSupplierDto name & website
   * @returns status & message & data
   */
  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.prisma.suppliers.findUnique({
      where: { id },
    });
    if (!supplier) throw new NotFoundException(`Supplier Not Found`);

    if (updateSupplierDto.name) {
      const supplierWithName = await this.prisma.suppliers.findFirst({
        where: { name: updateSupplierDto.name },
      });
      if (supplierWithName && supplierWithName.id !== id) {
        throw new HttpException(
          `You have already supplier with name: ${updateSupplierDto.name}`,
          400,
        );
      }
    }

    const supplierUpdated = await this.prisma.suppliers.update({
      where: { id },
      data: updateSupplierDto,
    });

    return {
      status: 200,
      message: 'Supplier updated successfully',
      data: supplierUpdated,
    };
  }

  /**
   * delete supplier by admin
   * @param id of supplier
   * @returns status & message
   */
  async remove(id: number) {
    const supplier = await this.prisma.suppliers.findUnique({
      where: { id },
    });
    if (!supplier) throw new NotFoundException(`Supplier Not Found`);

    await this.prisma.suppliers.delete({
      where: { id },
    });

    return {
      status: 200,
      message: `Supplier deleted successfully`,
    };
  }
}
