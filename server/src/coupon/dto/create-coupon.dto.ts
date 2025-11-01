import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsDateString(
    {},
    {
      message:
        'expireDate must be a valid date string in the format YYYY-MM-DD',
    },
  )
  @IsNotEmpty()
  expireDate: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  discount: number;
}
