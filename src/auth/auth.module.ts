import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GuardianModule } from 'src/guardian/guardian.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt-strategy';

@Module({  
    imports: [    
        GuardianModule,    
        PassportModule.register({
            defaultStrategy: 'jwt',
            property: 'user',
            session: false,
        }),
        JwtModule.register({
            secret: process.env.SECRETKEY, signOptions: {
                expiresIn: process.env.EXPIRESIN,
            },
        }),
    ], 
    controllers: [AuthController],  
    providers: [AuthService, JwtStrategy],  
    exports: [
        PassportModule, 
        JwtModule
    ],
})
export class AuthModule {}