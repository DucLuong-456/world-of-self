import { UserRole } from '@constants/userRole.enum';
import { PaginationDto } from '@dtos/pagination.dto';
import { JwtAuthGuard } from '@modules/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guard/role.guard';
import { appSwaggerTag } from '@modules/swagger-app/swagger-app.constant';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/role.decorator';
import {
  BaseResponse,
  PagingResponse,
  TransformInterceptor,
} from 'src/interceptors/transform.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { CheckInDto } from './dto/user-check-in.dto';
import { UserService } from './user.service';

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

  @Patch('/check-in')
  async checkIn(@Body() data: CheckInDto) {
    return await this.userService.checkIn(data);
  }
}
