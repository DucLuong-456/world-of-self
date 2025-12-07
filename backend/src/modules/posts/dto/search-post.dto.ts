import { PaginationDto } from '@dtos/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchPostDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  keyword: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId: string;
}
