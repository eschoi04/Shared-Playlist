import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class RoomRepository {
  constructor(private readonly prisma: PrismaService) {}

  // POST .../rooms, in default, the room expires in 7 days.
  createRoom(expiresAt: Date) {
    console.log(expiresAt);
    return this.prisma.room.create({
      data: {
        expiresAt,
      },
    });
  }
}
