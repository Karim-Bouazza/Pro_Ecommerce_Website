import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateSupplierDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsUrl()
    @IsString()
    @IsNotEmpty()
    website: string;
}
