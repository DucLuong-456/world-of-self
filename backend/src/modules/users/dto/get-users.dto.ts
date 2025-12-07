import { PaginationDto } from '@dtos/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetUsersDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  q?: string;
}
