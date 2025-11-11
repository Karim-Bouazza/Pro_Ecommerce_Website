import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateCartItemDto {
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    quantity: number;

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    color?: string
}
