import { IsString } from 'class-validator';

export class AuthCredDto {
    
    @IsString()
    readonly email: string;

    @IsString()
    readonly password: string;
}
