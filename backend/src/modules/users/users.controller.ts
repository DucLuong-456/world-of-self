import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  BaseResponse,
  PagingResponse,
} from 'src/interceptors/transform.interceptor';
import { GetUsersDto } from './dto/get-users.dto';
import { UsersService } from './users.service';
import { UserRole } from '@constants/userRole.enum';
import { Auth } from 'src/decorators/auth.decorator';

@Auth(UserRole.User)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() data: GetUsersDto) {
    const { users, paging } = await this.usersService.findAll(data);
    return new PagingResponse(users, paging);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return new BaseResponse(await this.usersService.findOne(id));
  }
}
