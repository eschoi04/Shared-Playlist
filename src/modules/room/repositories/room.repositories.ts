import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
@Injectable()
export class RoomRepository {
  constructor(private readonly prisma: PrismaService) {}

  // POST .../rooms, in default, the room expires in 7 days.
  createRoom(expiresAt: Date) {
    return this.prisma.room.create({
      data: {
        expiresAt,
      },
    });
  }

  // POST .../rooms/{publicId}/enter, in default, the cookie expires in 7 days.
  getRoomIdByPublicId(publicId: string) {
    return this.prisma.room.findFirst({
      select: {
        id: true,
      },
      where: {
        publicId,
      },
    });
  }

  createUser(name: string, roomId: bigint) {
    return this.prisma.user.create({
      data: {
        name,
        roomId,
      },
    });
  }

  upsertSession(roomId: bigint, userId: bigint, expiresAt: Date) {
    return this.prisma.session.upsert({
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
      update: {
        expiresAt,
      },
      create: {
        roomId,
        userId,
        expiresAt,
      },
    });
  }

  findUserByName(name: string, roomId: bigint) {
    return this.prisma.user.findFirst({
      where: {
        name,
        roomId,
      },
    });
  }

  // DELETE .../rooms/{publicId}
  findUserById(userId: bigint, roomId: bigint) {
    return this.prisma.user.findFirst({
      where: {
        id: userId,
        roomId,
      },
    });
  }

  deleteRoom(publicId: string) {
    return this.prisma.room.delete({
      where: {
        publicId,
      },
    });
  }
}
