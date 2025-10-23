import { Length } from "class-validator";

export class CreateResetPasswordCodeDto {
    @Length(6, 6, { message: "Verification code must be 6 digits" })
    code: string;
}