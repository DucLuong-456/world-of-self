import { PaginationDto } from '@dtos/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class SearchFriendDto extends PaginationDto {
  @IsOptional()
  @IsString()
  q: string;
}
