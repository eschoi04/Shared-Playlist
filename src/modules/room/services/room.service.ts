import { Injectable } from '@nestjs/common';
import { RoomRepository } from '../repositories/room.repositories';
import { CreateRoomDto } from '../dtos/room.dto';
@Injectable()
export class RoomService {
  constructor(private readonly roomRepository: RoomRepository) {}

  async createRoom(body: CreateRoomDto) {
    const expiresIn = body.expiresIn == null ? 7 : body.expiresIn;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresIn);

    const result = await this.roomRepository.createRoom(expiresAt);
    const serialized = {
      ...result,
      id: result.id.toString(),
    };
    return serialized;
  }
}
