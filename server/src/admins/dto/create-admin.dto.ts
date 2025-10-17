import { Gender, UserRole } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword, IsUrl, Length, Max, Min } from "class-validator";

export class CreateAdminDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 30)
    name: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 20)
    @IsStrongPassword()
    password: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsOptional()
    @IsString()
    @IsUrl()
    avatar: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    age: number;

    @IsOptional()
    @IsString()
    @Length(9, 10)
    phoneNumber: string;

    @IsOptional()
    @IsString()
    address: string;

    @IsOptional()
    active: boolean;

    @IsString()
    @IsOptional()
    verificationCode: string;

    @IsOptional()
    @IsString()
    @IsEnum(Gender)
    gender: Gender;
}