import { PaginationDto } from '@dtos/pagination.dto';
import { appSwaggerTag } from '@modules/swagger-app/swagger-app.constant';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  BaseResponse,
  PagingResponse,
  TransformInterceptor,
} from 'src/interceptors/transform.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@modules/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guard/role.guard';
import { UserRole } from '@constants/userRole.enum';
import { Roles } from 'src/decorators/role.decorator';

@ApiTags(appSwaggerTag.user)
@ApiBearerAuth()
@UseInterceptors(TransformInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  async findAll(@Query() data: PaginationDto) {
    const { users, paging } = await this.userService.findAll(data);
    return new PagingResponse(users, paging);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return new BaseResponse(await this.userService.findOne(id));
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
