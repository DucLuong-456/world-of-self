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

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  template_id?: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    nullable: true,
    required: false,
  })
  @IsOptional()
  images?: Express.Multer.File[];
}
