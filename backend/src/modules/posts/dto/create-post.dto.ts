import { PostCategory } from '@constants/postCategory';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { StoredImageDto } from './store-image.dto';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ enum: PostCategory })
  @IsEnum(PostCategory)
  category: PostCategory;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => StoredImageDto)
  image_metadata?: StoredImageDto;
}
