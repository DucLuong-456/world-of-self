import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthDto {
  @ApiProperty({
    description: 'Google access token from frontend',
    example: 'ya29.a0AfH6SMBx...',
  })
  @IsNotEmpty()
  @IsString()
  access_token: string;
}
