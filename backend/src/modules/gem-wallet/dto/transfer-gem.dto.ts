import { IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

export class TransferGemDto {
  @IsUUID()
  @IsNotEmpty()
  to_user_id: string;

  @IsPositive()
  @IsNotEmpty()
  amount: number;
}
