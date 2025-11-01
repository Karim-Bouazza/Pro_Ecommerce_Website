import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateRequestDto {
  @IsNotEmpty()
  @IsString()
  titleNeed: string;

  @IsNotEmpty()
  @IsString()
  details: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  qantity: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  category: string;
}
