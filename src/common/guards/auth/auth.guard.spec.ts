import { AuthGuard } from './auth.guard';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  const mockPrisma = {
    session: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(() => {
    guard = new AuthGuard(mockPrisma as unknown as PrismaService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
