import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDetailsDto } from './../user/dto/userdetails-dto';
import { JwtPayload } from './../shared/helper';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRETKEY,
      usernameField: 'email',
      password: 'password',
    });
  }

  async validate(JwtPayload: JwtPayload): Promise<UserDetailsDto> {
    return this.authService.validateUser(JwtPayload.email);
  }
}
