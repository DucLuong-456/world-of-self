import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsUUID('4')
  parent_id?: string;
}

export class UpdateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}
