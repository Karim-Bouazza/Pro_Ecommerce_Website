import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class RequestService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * user create request product
   * @param id of user
   * @param createRequestDto title & details & qantitiy & category
   * @returns status & message & data
   */
  async create(id: number, createRequestDto: CreateRequestDto) {
    const requestProduct = await this.prisma.requestProduct.create({
      data: {
        ...createRequestDto,
        userId: id,
      },
    });

    return {
      status: 201,
      message: 'Request Product created successfully',
      data: requestProduct,
    };
  }

  /**
   * find all requests-products by admin
   * @returns status & message & data
   */
  async findAll() {
    const requestsProducts = await this.prisma.requestProduct.findMany({
      include: { user: true },
    });

    return {
      status: 200,
      message: 'Requests-Products found',
      data: requestsProducts,
    };
  }

  /**
   * all requests-products create by userId
   * @param id of user id
   * @returns status & message & data
   */
  async findAllByUser(id: number) {
    const requestsProducts = await this.prisma.requestProduct.findMany({
      where: { userId: id },
    });

    return {
      status: 200,
      message: 'Requests-Products found',
      data: requestsProducts,
    };
  }

  /**
   * find request-product by admin and by user who send the request
   * @param id of request-product
   * @returns status & message & data
   */
  async findOne(user, id: number) {
    const requestProduct = await this.prisma.requestProduct.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!requestProduct)
      throw new NotFoundException(`Request-Product Not Found`);

    if (user.role !== UserRole.Admin) {
      if (user.id !== requestProduct.userId)
        throw new HttpException('Invalid Request', 404);
    }

    return {
      status: 200,
      message: 'Request-Product found',
      data: requestProduct,
    };
  }

  /**
   * update request-product by admin and user who create the request
   * @param userId of user
   * @param id of request-product
   * @param updateRequestDto title & details & qantitiy & category
   * @returns status & message & data
   */
  async update(user, id, updateRequestDto: UpdateRequestDto) {
    const requestProduct = await this.prisma.requestProduct.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!requestProduct)
      throw new NotFoundException(`Request-Product Not Found`);

    if (user.role !== UserRole.Admin) {
      if (user.id !== requestProduct.userId)
        throw new HttpException('Invalid Request', 404);
    }

    const requestProductUpdated = await this.prisma.requestProduct.update({
      where: { id },
      data: updateRequestDto,
    });

    return {
      status: 200,
      message: 'Request-Product found',
      data: requestProductUpdated,
    };
  }

  /**
   * request-product deleted by admin or user who was create the request
   * @param id of request-product
   * @returns status & message
   */
  async remove(user, id: number) {
    const requestProduct = await this.prisma.requestProduct.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!requestProduct)
      throw new NotFoundException(`Request-Product Not Found`);

    if (user.role !== UserRole.Admin) {
      if (user.id !== requestProduct.userId)
        throw new HttpException('Invalid Request', 404);
    }

    await this.prisma.requestProduct.delete({
      where: { id },
    });

    return {
      status: 200,
      message: `Request-Product deleted successfully`,
    };
  }
}
