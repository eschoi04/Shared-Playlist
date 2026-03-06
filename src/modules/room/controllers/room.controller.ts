import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  CreateRoomDto,
  CreateSessionDto,
  RoomResponseDto,
  SessionResponseDto,
} from '../dtos/room.dto';
import { RoomService } from '../services/room.service';
import { ApiOperation, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiOperation({ summary: '룸 생성하기' })
  @ApiOkResponse({ type: RoomResponseDto })
  @Post('')
  async createRoom(@Body() body: CreateRoomDto) {
    return await this.roomService.createRoom(body);
  }

  @ApiOperation({ summary: '로그인' })
  @ApiOkResponse({ type: SessionResponseDto })
  @ApiParam({
    name: 'publicId',
    description: 'uuid for each room',
  })
  @Post(':publicId/enter')
  async createSession(
    @Res({ passthrough: true }) response: Response,
    @Body() body: CreateSessionDto,
    @Param('publicId') publicId: string,
  ) {
    const result = await this.roomService.createSession(body, publicId);
    // lasts 7 days in default.
    response.cookie('room_session', result.sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: result.maxAge,
    });
    return { name: result.name, userId: result.userId };
  }

  @ApiOperation({ summary: '룸 삭제' })
  @ApiOkResponse()
  @ApiParam({
    name: 'publicId',
    description: 'uuid for each room',
  })
  @UseGuards(AuthGuard)
  @Delete(':publicId')
  async deleteRoom(@Req() req: Request, @Param('publicId') publicId: string) {
    if (!req.userId) throw new Error('userId is NOT defined.');
    await this.roomService.deleteRoom(req.userId, publicId);
  }
}
