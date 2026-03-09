import { Test, TestingModule } from '@nestjs/testing';
import { RoomCleanupService } from './room-cleanup.service';

describe('RoomCleanupService', () => {
  let service: RoomCleanupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomCleanupService],
    }).compile();

    service = module.get<RoomCleanupService>(RoomCleanupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
