import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class searchDto {
  @ApiProperty({ example: 'believe' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Weezer' })
  @IsOptional()
  @IsString()
  author?: string;
}

export class searchResponseDto {
  @ApiProperty({ example: 'Make Believe' })
  title: string;

  @ApiProperty({ example: 'Weezer' })
  author: string;

  @ApiProperty({ example: 'http://userserve-ak.last.fm/serve/example.jpg' })
  imageUrl: string;
}
