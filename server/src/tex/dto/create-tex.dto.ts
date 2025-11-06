import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateTexDto {
  @IsString()
  @IsNotEmpty()
  texName: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  texPrice: number;
}
