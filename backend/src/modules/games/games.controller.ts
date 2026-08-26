import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { UserRole } from '@constants/userRole.enum';
import { BaseResponse } from 'src/interceptors/transform.interceptor';
import { GamesService } from './games.service';

@ApiTags('Games')
@Auth(UserRole.User)
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('memory-match/start')
  async startMemoryMatch() {
    const data = await this.gamesService.startMemoryMatch();
    return new BaseResponse(data);
  }

  @Post('memory-match/end')
  async endMemoryMatch(@Body() body: { session_id: string }) {
    const data = await this.gamesService.endMemoryMatch(body.session_id);
    return new BaseResponse(data);
  }

  @Post('strikers/start')
  async startStrikers() {
    const data = await this.gamesService.startStrikers();
    return new BaseResponse(data);
  }

  @Post('strikers/end')
  async endStrikers(@Body() body: { session_id: string; score: number }) {
    const data = await this.gamesService.endStrikers(
      body.session_id,
      body.score,
    );
    return new BaseResponse(data);
  }
}
