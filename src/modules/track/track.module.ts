import { Module } from '@nestjs/common';
import { TrackController } from './controllers/track.controller';
import { TrackService } from './services/track.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [TrackController],
  providers: [TrackService],
  imports: [HttpModule],
})
export class TrackModule {}
