import { Test, TestingModule } from '@nestjs/testing';
import { RoomTrackController } from './room-track.controller';

describe('RoomTrackController', () => {
  let controller: RoomTrackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomTrackController],
    }).compile();

    controller = module.get<RoomTrackController>(RoomTrackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
