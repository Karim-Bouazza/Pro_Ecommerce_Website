import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  @IsStrongPassword()
  password: string;
}
