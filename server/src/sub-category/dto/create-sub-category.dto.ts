import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}
