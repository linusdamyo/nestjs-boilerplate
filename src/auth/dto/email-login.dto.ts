import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EmailLoginDto {
    @ApiProperty({ description: '이메일' })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ description: '비밀번호' })
    @IsNotEmpty()
    @IsString()
    password: string;
}

export class EmailLoginResponseDto {
    @ApiProperty({ description: 'JWT access token' })
    accessToken: string;
}
