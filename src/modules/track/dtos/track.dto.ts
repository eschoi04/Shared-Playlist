import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class searchDto {
  @ApiProperty({ example: 'bandaids' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Keshi' })
  @IsOptional()
  @IsString()
  author?: string;
}

export class searchResponseDto {
  @ApiProperty({ example: 'bandaids' })
  title: string;

  @ApiProperty({ example: 'Keshi' })
  author: string;

  @ApiProperty({ example: 'http://userserve-ak.last.fm/serve/example.jpg' })
  imageUrl?: string;
}

export class addTrackDto {
  @ApiProperty({ example: 'bandaids' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Keshi' })
  @IsString()
  author: string;

  @ApiProperty({ example: 'http://userserve-ak.last.fm/serve/example.jpg' })
  @IsString()
  imageUrl?: string;
}
