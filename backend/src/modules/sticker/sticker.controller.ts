import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { UserRole } from '@constants/userRole.enum';
import { StickerPack } from '@entities/StickerPack';
import { StickerService } from './sticker.service';

@ApiTags('Chat - Stickers')
@Auth(UserRole.User, UserRole.Admin)
@Controller('chat/stickers')
export class StickerController {
  constructor(private readonly stickerService: StickerService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy các bộ sticker đang hoạt động cho người dùng chat',
  })
  async getActiveStickers(): Promise<{ data: StickerPack[] }> {
    const data = await this.stickerService.getActivePacks();
    return { data };
  }
}
