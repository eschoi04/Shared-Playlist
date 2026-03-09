import { Module } from '@nestjs/common';
import { TrackController } from './controllers/track.controller';
import { TrackService } from './services/track.service';
import { HttpModule } from '@nestjs/axios';
import { RoomTrackController } from './controllers/room-track.controller';
import { RoomRepository } from '../room/repositories/room.repositories';
import { TrackRepository } from './repositories/track.repositories';

@Module({
  controllers: [TrackController, RoomTrackController],
  providers: [TrackService, TrackRepository, RoomRepository],
  imports: [HttpModule],
})
export class TrackModule {}
