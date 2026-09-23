import { UserRole } from '@constants/userRole.enum';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { BaseResponse } from 'src/interceptors/transform.interceptor';
import { UserItemsService } from './user-items.service';

@ApiTags('User Items')
@Auth(UserRole.User)
@Controller('user-items')
export class UserItemsController {
  constructor(private readonly userItemsService: UserItemsService) {}

  /** Kho vật phẩm của tôi */
  @Get('me')
  async getMyItems() {
    const items = await this.userItemsService.getMyItems();
    return new BaseResponse(items);
  }
}
