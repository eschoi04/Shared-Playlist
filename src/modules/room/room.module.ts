import { Module } from '@nestjs/common';
import { RoomController } from './controllers/room.controller';
import { RoomService } from './services/room.service';
import { RoomRepository } from './repositories/room.repositories';
import { RoomCleanupService } from './services/room-cleanup.service';

@Module({
  controllers: [RoomController],
  providers: [
    RoomService,
    RoomRepository,
    RoomCleanupService,
    RoomCleanupService,
  ],
  exports: [RoomRepository],
})
export class RoomModule {}
