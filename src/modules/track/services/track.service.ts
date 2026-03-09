import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  dislikeResponseDto,
  getTracksDto,
  searchResponseDto,
} from '../dtos/track.dto';
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
    try {
      await this.trackRepository.addTrack(
        title,
        author,
        BigInt(addedBy),
        room.id,
        imageUrl,
      );
    } catch {
      throw new Error('this song has already been added.');
    }
  }

  async deleteTrack(userId: string, trackId: string) {
    const deletable = await this.trackRepository.findUserTrack(
      BigInt(userId),
      BigInt(trackId),
    );

    if (!deletable)
      throw new Error('this user is NOT eligible to delete this track.');

    await this.trackRepository.deleteTrack(BigInt(trackId));
  }

  async getAllTracks(publicId: string, userId: string, cursor?: string) {
    const take: number = 20;

    const room = await this.roomRepository.getRoomIdByPublicId(publicId);
    if (!room) throw new Error('room does not exist.');

    const authorized = await this.roomRepository.findUserById(
      BigInt(userId),
      room.id,
    );

    if (!authorized) throw new Error('this user does NOT belong to the room.');

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

  async getAllTracksByUser(
    publicId: string,
    reqUserId: string,
    addedUserId: string,
    cursor?: string,
  ) {
    const take: number = 20;
    // check if the room exists.
    const room = await this.roomRepository.getRoomIdByPublicId(publicId);
    if (!room) throw new Error('room does not exist.');

    // check if the owner of the request is authorized.
    const authorized = await this.roomRepository.findUserById(
      BigInt(reqUserId),
      room.id,
    );
    if (!authorized) throw new Error('this user does NOT belong to the room.');

    // check if the given userId belongs to the room.
    const authorizedAddedBy = await this.roomRepository.findUserById(
      BigInt(addedUserId),
      room.id,
    );
    if (!authorizedAddedBy)
      throw new Error('this user does NOT belong to the room.');

    // get the result.
    const result = await this.trackRepository.getAllTracksByUser(
      BigInt(addedUserId),
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

  async dislikeTrack(userId: string, publicId: string, trackId: string) {
    // find roomId by publicId.
    const roomId = await this.roomRepository.getRoomIdByPublicId(publicId);
    if (!roomId)
      throw new Error('could NOT find a room that matches given publicId.');

    // check if this user belongs to the room.
    const exists = await this.roomRepository.findUserById(
      BigInt(userId),
      roomId.id,
    );
    if (!exists)
      throw new Error('this user is NOT entitled to dislike the track.');

    // add +1 dislike the given track.
    const result = await this.trackRepository.dislikeTrack(BigInt(trackId));

    const returnResult: dislikeResponseDto = {
      dislike: result.dislike.toString(),
    };

    return returnResult;
  }
}
