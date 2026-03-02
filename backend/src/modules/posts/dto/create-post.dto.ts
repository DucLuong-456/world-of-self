import { PostCategory } from '@constants/postCategory';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ enum: PostCategory, required: false })
  @IsEnum(PostCategory)
  @IsOptional()
  category?: PostCategory;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    nullable: true,
    required: false,
  })
  @IsOptional()
  thumbnail?: Express.Multer.File | null;
}
