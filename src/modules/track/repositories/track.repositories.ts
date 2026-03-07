import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class TrackRepository {
  constructor(private readonly prisma: PrismaService) {}

  // POST .../tracks
  async addTrack(
    title: string,
    author: string,
    addedBy: bigint,
    roomId: bigint,
    imageUrl?: string,
  ) {
    return await this.prisma.track.create({
      data: {
        title,
        author,
        addedBy,
        roomId,
        imageUrl,
      },
    });
  }

  // DELETE .../tracks
  async findUserTrack(userId: bigint, trackId: bigint) {
    return await this.prisma.track.findFirst({
      where: {
        id: trackId,
        addedBy: userId,
      },
    });
  }

  async deleteTrack(trackId: bigint) {
    return await this.prisma.track.delete({
      where: {
        id: trackId,
      },
    });
  }

  // GET .../tracks
  async getAllTracks(roomId: bigint, cursor?: bigint, take?: number) {
    return await this.prisma.track.findMany({
      take: take,
      where: {
        roomId,
      },
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: {
        id: 'asc',
      },
      include: {
        user: true,
      },
    });
  }

  // GET .../users/{userId}/tracks
  async getAllTracksByUser(userId: bigint, cursor?: bigint, take?: number) {
    return await this.prisma.track.findMany({
      take: take,
      where: {
        addedBy: userId,
      },
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: {
        id: 'asc',
      },
      include: {
        user: true,
      },
    });
  }
}
