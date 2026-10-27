import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStickerPackDto {
  @ApiProperty({ description: 'Tên bộ sticker' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Mô tả bộ sticker' })
  @IsOptional()
  @IsString()
  description?: string;
}
