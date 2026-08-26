import { UserRole } from '@constants/userRole.enum';
import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { BaseResponse } from 'src/interceptors/transform.interceptor';
import { DailyCheckInService } from './daily-checkin.service';

@ApiTags('Daily Check-In')
@Auth(UserRole.User)
@Controller('daily-checkin')
export class DailyCheckInController {
  constructor(private readonly service: DailyCheckInService) {}

  /** Trạng thái điểm danh hôm nay + lịch sử 7 ngày */
  @Get('status')
  async getStatus() {
    const data = await this.service.getStatus();
    return new BaseResponse(data);
  }

  /** Thực hiện điểm danh */
  @Post()
  async checkIn() {
    const data = await this.service.checkIn();
    return new BaseResponse(data);
  }
}
