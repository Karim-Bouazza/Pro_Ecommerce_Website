import { Gender, UserRole } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword, IsUrl, Length, Max, Min } from "class-validator";

export class UpdateAdminDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 30)
    @IsOptional()
    name: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 20)
    @IsStrongPassword()
    @IsOptional()
    password: string;

    @IsEnum(UserRole)
    @IsOptional()
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