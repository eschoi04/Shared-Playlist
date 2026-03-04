import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { searchResponseDto } from '../dtos/track.dto';
import { TrackService } from '../services/track.service';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @ApiOperation({ summary: 'search for the track' })
  @ApiOkResponse({ type: searchResponseDto })
  @ApiQuery({
    required: true,
    name: 'track',
    description: 'keyword for the track',
  })
  @ApiQuery({
    required: false,
    name: 'artist',
    description: 'keyword for the artist',
  })
  @ApiQuery({
    required: false,
    name: 'page',
    description: 'the number of page',
  })
  @ApiQuery({
    required: false,
    name: 'limit',
    description: 'the number of result per page',
  })
  @Get('/search')
  @UseGuards(AuthGuard)
  searchTrack(@Query('track') track: string, @Query('artist') artist: string) {
    return this.trackService.searchTrack(track, artist);
  }
}
