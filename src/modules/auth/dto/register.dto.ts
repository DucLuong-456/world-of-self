import { UserRole } from '@constants/userRole.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEmpty, IsEnum, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @IsEmpty()
  name: string;

  @ApiProperty()
  @IsEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @IsEmpty()
  password: string;

  @ApiProperty()
  @IsEnum(UserRole)
  @IsEmpty()
  role: UserRole;
}
