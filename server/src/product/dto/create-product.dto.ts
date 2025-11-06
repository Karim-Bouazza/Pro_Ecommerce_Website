import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(500)
  quantity: number;

  @IsNotEmpty()
  @IsString()
  imageCover: string;

  @IsNotEmpty()
  @IsOptional()
  images: string[];

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100000)
  price: number;

  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100000)
  priceAfterDiscount: number;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  colors: string[];

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  subCategoryId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  brandId: number;
}
