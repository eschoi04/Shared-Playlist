import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiPropertyOptional({ example: 7 })
  @IsOptional()
  @IsNumber()
  expiresIn?: number;
}

export class RoomResponseDto {
  @ApiProperty({ example: 1 })
  id: string;

  @ApiProperty({ example: 'random uuid' })
  publicId: string;

  @ApiProperty({ example: 'date' })
  createdAt: string;

  @ApiProperty({ example: 'date' })
  expiresAt: string;
}

export class CreateSessionDto {
  @ApiProperty({ example: 'eunsong' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 7 })
  @IsOptional()
  @IsNumber()
  expiresIn?: number;
}

export class SessionResponseDto {
  @ApiProperty({ example: 1 })
  userId: string;

  @ApiProperty({ example: 'eunsong' })
  name: string;
}
