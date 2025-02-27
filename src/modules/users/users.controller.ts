import { PaginationDto } from '@dtos/pagination.dto';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  BaseResponse,
  PagingResponse,
} from 'src/interceptors/transform.interceptor';
import { SearchFriendDto } from './dto/search-friend.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(@Query() data: PaginationDto) {
    const { users, paging } = await this.usersService.findAll(data);
    return new PagingResponse(users, paging);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return new BaseResponse(await this.usersService.findOne(id));
  }
  @Get('/:id/friends')
  async getFriends(@Param('id') id: string, @Query() data: SearchFriendDto) {
    return await this.usersService.getFriends(id, data);
  }
}
