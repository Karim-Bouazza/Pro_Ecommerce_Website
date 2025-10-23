import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class EmailResetPasswordDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
