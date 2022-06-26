import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GuardianModule } from 'src/guardian/guardian.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({  
    imports: [    
        GuardianModule,    
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
              secret: configService.get<string>("SECRETKEY"),
              signOptions: { expiresIn: configService.get<string>("EXPIRESIN") },
            }),
        }),
    ], 
    controllers: [AuthController], 
    providers: [AuthService, JwtStrategy],
    exports: [ JwtModule, JwtStrategy, PassportModule ],
})
export class AuthModule {}