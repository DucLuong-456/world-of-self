import { UserRole } from '@constants/userRole.enum';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import {
  BaseResponse,
  PagingResponse,
} from 'src/interceptors/transform.interceptor';
import { RedeemInviteCodeDto } from './dto/redeem-invite-code.dto';
import { TransferGemDto } from './dto/transfer-gem.dto';
import { GemWalletService } from './gem-wallet.service';

@ApiTags('Gem Wallet')
@Auth(UserRole.User)
@Controller('gem-wallet')
export class GemWalletController {
  constructor(private readonly gemWalletService: GemWalletService) {}

  /** Lấy số dư ví */
  @Get('me')
  async getMyWallet() {
    const wallet = await this.gemWalletService.getMyWallet();
    return new BaseResponse(wallet);
  }

  /** Lịch sử giao dịch */
  @Get('me/transactions')
  async getMyTransactions(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const { transactions, paging } =
      await this.gemWalletService.getMyTransactions(page, limit);
    return new PagingResponse(transactions, paging);
  }

  /** Nhập mã mời để nhận Ngọc Vàng */
  @Post('redeem')
  async redeemInviteCode(@Body() dto: RedeemInviteCodeDto) {
    const result = await this.gemWalletService.redeemInviteCode(dto);
    return new BaseResponse(result);
  }

  /** Chuyển Ngọc Vàng cho user khác */
  @Post('transfer')
  async transfer(@Body() dto: TransferGemDto) {
    const result = await this.gemWalletService.transfer(dto);
    return new BaseResponse(result);
  }
}
