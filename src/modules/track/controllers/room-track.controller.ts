import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TrackService } from '../services/track.service';
import { addTrackDto, getTracksDto } from '../dtos/track.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import type { Request } from 'express';

@Controller('rooms/:publicId')
export class RoomTrackController {
  constructor(private readonly trackService: TrackService) {}

  @ApiOperation({ summary: '플레이리스트에 음악 추가' })
  @ApiOkResponse()
  @ApiParam({
    name: 'publicId',
    description: 'uuid for each room',
  })
  @UseGuards(AuthGuard)
  @Post('tracks')
  async addTrack(
    @Body() body: addTrackDto,
    @Req() req: Request,
    @Param('publicId') publicId: string,
  ) {
    if (!req.userId) throw new Error('please login first.');
    await this.trackService.addTrack(
      body.title,
      body.author,
      req.userId,
      publicId,
      body.imageUrl,
    );
  }

  @ApiOperation({ summary: '특정 음악 삭제' })
  @ApiOkResponse()
  @ApiParam({
    name: 'trackId',
    description: 'id for each track',
  })
  @UseGuards(AuthGuard)
  @Delete('tracks/:trackId')
  async deleteTrack(@Req() req: Request, @Param('trackId') trackId: string) {
    if (!req.userId) throw new Error('please login first.');
    await this.trackService.deleteTrack(req.userId, trackId);
  }

  @ApiOperation({ summary: '전체 플레이리스트 조회' })
  @ApiOkResponse({ type: getTracksDto })
  @ApiQuery({
    required: false,
    name: 'cursor',
    description: 'cursor for paging',
  })
  @UseGuards(AuthGuard)
  @Get('tracks')
  async getAllTracks(
    @Req() req: Request,
    @Param('publicId') publicId: string,
    @Query('cursor') cursor: string,
  ) {
    if (!req.userId) throw new Error('please login first.');
    return await this.trackService.getAllTracks(publicId, req.userId, cursor);
  }

  @ApiOperation({ summary: '특정 유저가 추가한 곡 조회' })
  @ApiOkResponse({ type: getTracksDto })
  @ApiQuery({
    required: false,
    name: 'cursor',
    description: 'cursor for paging',
  })
  @ApiParam({
    name: 'userId',
    description: 'userId',
  })
  @UseGuards(AuthGuard)
  @Get('users/:userId/tracks')
  async getAllTracksByUser(
    @Req() req: Request,
    @Param('publicId') publicId: string,
    @Query('cursor') cursor: string,
    @Param('userId') userId: string,
  ) {
    if (!req.userId) throw new Error('please login first.');
    return await this.trackService.getAllTracksByUser(
      publicId,
      req.userId,
      userId,
      cursor,
    );
  }
}
