import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ItemRarity } from '@entities/Item';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsInt()
  @IsPositive()
  gem_price: number;

  @IsEnum(ItemRarity)
  @IsOptional()
  rarity?: ItemRarity;
}
