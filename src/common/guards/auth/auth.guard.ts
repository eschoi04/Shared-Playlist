import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token: string = request.cookies.room_session as string;

    if (!token) throw new UnauthorizedException('token does not exist.');

    const session = await this.prisma.session.findFirst({
      where: {
        id: token,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: { user: true },
    });

    if (!session) throw new UnauthorizedException('session does not exist.');

    request.userId = session.userId.toString();
    request.name = session.user.name;

    return true;
  }
}
