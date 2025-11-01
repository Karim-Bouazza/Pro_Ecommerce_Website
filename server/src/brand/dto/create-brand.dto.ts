import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBrandDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    image: string;
}