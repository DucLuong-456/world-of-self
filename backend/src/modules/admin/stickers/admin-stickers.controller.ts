import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { UserRole } from '@constants/userRole.enum';
import { StickerPack } from '@entities/StickerPack';
import { Sticker } from '@entities/Sticker';
import { AdminStickersService } from './admin-stickers.service';
import { CreateStickerPackDto } from './dto/create-sticker-pack.dto';
import { UpdateStickerPackDto } from './dto/update-sticker-pack.dto';

@ApiTags('Admin - Stickers')
@Auth(UserRole.Admin)
@Controller('admin/stickers')
export class AdminStickersController {
  constructor(private readonly adminStickersService: AdminStickersService) {}

  @Post('packs')
  @ApiOperation({ summary: 'Tạo bộ sticker mới kèm icon đại diện' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('icon'))
  async createPack(
    @Body() dto: CreateStickerPackDto,
    @UploadedFile() icon?: Express.Multer.File,
  ): Promise<{ data: StickerPack; message: string }> {
    const data = await this.adminStickersService.createPack(dto, icon);
    return { data, message: 'Tạo bộ sticker thành công' };
  }

  @Get('packs')
  @ApiOperation({ summary: 'Lấy tất cả các bộ sticker cho admin' })
  async getPacks(): Promise<{ data: StickerPack[] }> {
    const data = await this.adminStickersService.getPacks();
    return { data };
  }

  @Get('packs/:id')
  @ApiOperation({ summary: 'Lấy chi tiết một bộ sticker' })
  async getPackById(@Param('id') id: string): Promise<{ data: StickerPack }> {
    const data = await this.adminStickersService.getPackById(id);
    return { data };
  }

  @Patch('packs/:id')
  @ApiOperation({ summary: 'Cập nhật thông tin hoặc icon bộ sticker' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('icon'))
  async updatePack(
    @Param('id') id: string,
    @Body() dto: UpdateStickerPackDto,
    @UploadedFile() icon?: Express.Multer.File,
  ): Promise<{ data: StickerPack; message: string }> {
    const data = await this.adminStickersService.updatePack(id, dto, icon);
    return { data, message: 'Cập nhật bộ sticker thành công' };
  }

  @Delete('packs/:id')
  @ApiOperation({ summary: 'Xóa một bộ sticker' })
  async deletePack(@Param('id') id: string): Promise<{ message: string }> {
    await this.adminStickersService.deletePack(id);
    return { message: 'Xóa bộ sticker thành công' };
  }

  @Post('packs/:id/stickers')
  @ApiOperation({ summary: 'Upload hàng loạt sticker vào một bộ' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 50))
  async addStickers(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ data: Sticker[]; message: string }> {
    const data = await this.adminStickersService.addStickersToPack(
      id,
      files || [],
    );
    return { data, message: `Đã thêm ${data.length} sticker vào bộ` };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa một sticker' })
  async deleteSticker(@Param('id') id: string): Promise<{ message: string }> {
    await this.adminStickersService.deleteSticker(id);
    return { message: 'Xóa sticker thành công' };
  }
}
