import { UserRole } from '@constants/userRole.enum';
import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { BaseResponse } from 'src/interceptors/transform.interceptor';
import { SpinService } from './spin.service';

@ApiTags('Spin')
@Auth(UserRole.User)
@Controller('spin')
export class SpinController {
  constructor(private readonly spinService: SpinService) {}

  /** Trạng thái vòng quay hôm nay */
  @Get('status')
  async getStatus() {
    const data = await this.spinService.getStatus();
    return new BaseResponse(data);
  }

  /** Thực hiện quay */
  @Post()
  async spin() {
    const data = await this.spinService.spin();
    return new BaseResponse(data);
  }
}
