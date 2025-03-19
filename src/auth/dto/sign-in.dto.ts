import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInRequestDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    readonly username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    readonly password: string;
}

export class SignInResponseDto {
    readonly accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }
}
