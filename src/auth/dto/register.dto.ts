import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  // C1 - campo extra city
  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(3)
  password!: string;
}
