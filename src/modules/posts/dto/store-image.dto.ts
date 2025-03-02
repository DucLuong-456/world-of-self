import { ApiProperty } from '@nestjs/swagger';

export class StoredImageDto {
  @ApiProperty()
  path: string;

  @ApiProperty()
  ext: string;
}
