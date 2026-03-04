import { Body, Controller, Param, Post, Res } from '@nestjs/common';
import {
  CreateRoomDto,
  CreateSessionDto,
  RoomResponseDto,
  SessionResponseDto,
} from '../dtos/room.dto';
import { RoomService } from '../services/room.service';
import { ApiOperation, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import type { Response } from 'express';

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
}
