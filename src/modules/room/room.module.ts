import { Module } from '@nestjs/common';
import { RoomController } from './controllers/room.controller';
import { RoomService } from './services/room.service';
import { RoomRepository } from './repositories/room.repositories';

@Module({
  controllers: [RoomController],
  providers: [RoomService, RoomRepository],
  exports: [RoomRepository],
})
export class RoomModule {}
