import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class RoomCleanupService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 * * * *')
  async deleteExpiredRooms() {
    const now = new Date();

    const result = await this.prisma.room.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    console.log(`Deleted ${result.count} expired rooms`);
  }
}
