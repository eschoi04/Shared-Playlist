import { Body, Controller, Post } from '@nestjs/common';
import { CreateRoomDto, RoomResponseDto } from '../dtos/room.dto';
import { RoomService } from '../services/room.service';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiOperation({ summary: '룸 생성하기' })
  @ApiOkResponse({ type: RoomResponseDto })
  @Post('')
  async createRoom(@Body() body: CreateRoomDto) {
    return await this.roomService.createRoom(body);
  }
}
