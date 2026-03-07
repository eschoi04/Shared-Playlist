import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { getTracksDto, searchResponseDto } from '../dtos/track.dto';
import { TrackRepository } from '../repositories/track.repositories';
import { RoomRepository } from 'src/modules/room/repositories/room.repositories';

interface LastfmTrack {
  data: {
    results: {
      trackmatches: {
        track: {
          name: string;
          artist: string;
          url: string;
          streamable: string;
          listeners: string;
          image: {
            '#text': string;
            size: string;
          }[];
          mbid: string;
        }[];
      };
    };
  };
}
@Injectable()
export class TrackService {
  constructor(
    private readonly httpService: HttpService,
    private readonly trackRepository: TrackRepository,
    private readonly roomRepository: RoomRepository,
  ) {}

  async searchTrack(title: string, author?: string) {
    // null check
    if (!process.env.BASE_URL)
      throw new Error('BASE_URL has NOT been defined.');
    if (!process.env.LAST_FM_API_KEY)
      throw new Error('Last.fm api key has NOT been defined.');

    const result: LastfmTrack = await firstValueFrom(
      this.httpService.get(process.env.BASE_URL, {
        params: {
          method: 'track.search',
          track: title,
          artist: author,
          api_key: process.env.LAST_FM_API_KEY,
          format: 'json',
        },
      }),
    );
    const tracks = result.data.results.trackmatches.track;
    const refinedResult: searchResponseDto[] = tracks.map((track) => ({
      title: track.name,
      author: track.artist,
      imageUrl: track.image?.[2]?.['#text'],
    }));

    return refinedResult;
  }

  async addTrack(
    title: string,
    author: string,
    addedBy: string,
    publicId: string,
    imageUrl?: string,
  ) {
    const room = await this.roomRepository.getRoomIdByPublicId(publicId);
    if (!room) throw new Error('given room does NOT exist.');

    await this.trackRepository.addTrack(
      title,
      author,
      BigInt(addedBy),
      room.id,
      imageUrl,
    );
  }

  async deleteTrack(userId: string, trackId: string) {
    const deletable = await this.trackRepository.findUserTrack(
      BigInt(userId),
      BigInt(trackId),
    );

    if (!deletable)
      throw new Error('this user is NOT eligible to delete this track.');

    const result = await this.trackRepository.deleteTrack(BigInt(trackId));
    console.log(result);
  }

  async getAllTracks(publicId: string, userId: string, cursor?: string) {
    const take: number = 20;

    const room = await this.roomRepository.getRoomIdByPublicId(publicId);
    if (!room) throw new Error('room does not exist.');

    const deletable = await this.roomRepository.findUserById(
      BigInt(userId),
      room.id,
    );

    if (!deletable) throw new Error('this user does NOT belong to the room.');

    const result = await this.trackRepository.getAllTracks(
      room.id,
      cursor == undefined ? undefined : BigInt(cursor),
      take,
    );
    if (!result) return result;

    const refinedResult: getTracksDto[] = result.map((track) => ({
      title: track.title,
      author: track.author,
      dislike: track.dislike,
      addedBy: track.user.name,
      createdAt: track.createdAt.toISOString(),
      imageUrl: track.imageUrl ?? undefined,
    }));

    const nextCursor =
      result.length === take ? result[result.length - 1].id : null;

    return {
      tracks: refinedResult,
      nextCursor: nextCursor?.toString() ?? null,
    };
  }
}
