import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDetailsDto } from 'src/guardian/dto/userdetails-dto';
import { GuardianService } from 'src/guardian/guardian.service';
import { JwtPayload, toUserDetailsDto } from 'src/shared/helper';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { 
    constructor(private readonly guardianService: GuardianService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRETKEY,
        });  
    }
    
    async validate(payload: JwtPayload): Promise<UserDetailsDto> {
        const user = await this.guardianService.findOneGuardian(payload.email);
        if (!user) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);    
        }    
        return toUserDetailsDto(user);  
    }
}
