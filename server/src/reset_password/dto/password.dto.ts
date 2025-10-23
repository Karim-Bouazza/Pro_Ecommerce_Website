import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class CreateResetPasswordDto {

  @Length(6, 6, { message: 'Verification code must be 6 digits' })
  code: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  @IsStrongPassword()
  password: string;
}
