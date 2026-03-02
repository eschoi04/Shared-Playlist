import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateRoomDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  expiresIn?: number;
}

export class RoomResponseDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  @Transform(({ value }) => value.toString())
  @ApiProperty({ example: 1 })
  id: string;

  @ApiProperty({ example: 'random uuid' })
  publicId: string;

  @ApiProperty({ example: 'date' })
  createdAt: string;

  @ApiProperty({ example: 'date' })
  expiresAt: string;
}
