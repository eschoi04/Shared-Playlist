import { Injectable } from '@nestjs/common';
import { RoomRepository } from '../repositories/room.repositories';
import { CreateRoomDto, CreateSessionDto } from '../dtos/room.dto';
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

  async createSession(body: CreateSessionDto, publicId: string) {
    const expiresIn = body.expiresIn == null ? 7 : body.expiresIn;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresIn);

    const roomInfo = await this.roomRepository.getRoomIdByPublicId(publicId);
    // better to wrap error response with custom error codes later on..
    if (!roomInfo) throw new Error('roominfo does not exist.');
    const userInfo = await this.roomRepository.createUser(
      body.name,
      roomInfo.id,
    );
    if (!userInfo) throw new Error('userinfo does not exist.');
    const result = await this.roomRepository.createSession(
      roomInfo.id,
      userInfo.id,
      expiresAt,
    );
    const serialized = {
      userId: result.userId.toString(),
      name: body.name,
      sessionId: result.id,
      maxAge: expiresIn * 1000 * 60 * 60 * 24,
    };
    return serialized;
  }
}
