import { UserRole } from '@constants/userRole.enum';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { BaseResponse } from 'src/interceptors/transform.interceptor';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemsService } from './items.service';

@ApiTags('Items')
@Auth(UserRole.User)
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  /** Danh sách vật phẩm trong shop */
  @Get()
  async getItems() {
    const items = await this.itemsService.getItems();
    return new BaseResponse(items);
  }

  /** Chi tiết vật phẩm */
  @Get(':id')
  async getItem(@Param('id') id: string) {
    const item = await this.itemsService.getItem(id);
    return new BaseResponse(item);
  }

  /** Tạo vật phẩm mới (Admin only) */
  @Post()
  @Auth(UserRole.Admin)
  async createItem(@Body() dto: CreateItemDto) {
    const item = await this.itemsService.createItem(dto);
    return new BaseResponse(item);
  }

  /** Mua vật phẩm */
  @Post(':id/buy')
  async buyItem(@Param('id') id: string) {
    const result = await this.itemsService.buyItem(id);
    return new BaseResponse(result);
  }
}
