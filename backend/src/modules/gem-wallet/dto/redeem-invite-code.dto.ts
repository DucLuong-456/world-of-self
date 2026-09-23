import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RedeemInviteCodeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  code: string;
}
