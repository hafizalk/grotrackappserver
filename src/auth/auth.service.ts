import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredDto } from 'src/guardian/dto/auth-cred-dto';
import { CreateUserDto } from 'src/guardian/dto/newuser-dto';
import { UserDetailsDto } from 'src/guardian/dto/userdetails-dto';
import { GuardianService } from 'src/guardian/guardian.service';
import { JwtPayload, LoginStatus, RegistrationStatus } from 'src/shared/helper';

@Injectable()
export class AuthService {

    constructor(
        private readonly guardianService: GuardianService,
        private readonly jwtService: JwtService
    ) {}


    async signUp(userDto: CreateUserDto): Promise<RegistrationStatus> {
        let status: RegistrationStatus = {
        success: true,   
        message: 'Successfully registered user',
        };
        try {
            await this.guardianService.createNewUser(userDto);
        } catch (err) {
            status = {
                success: false, 
                message: "Error registering user: ".concat(err),
            };    
    }
        return status;  
    }

    async login(loginUser: AuthCredDto): Promise<LoginStatus> {    
        // find user in db    
        const user = await this.guardianService.findByLogin(loginUser);
        // generate and sign token    
        const token = this.createToken(user);
        
        return {
            username: user.email, ...token,
        };  
    }
    
    private createToken({ email }: UserDetailsDto): any {
        const user: JwtPayload = { email };    
        const accessToken = this.jwtService.sign(user);    
        return {
            expiresIn: process.env.EXPIRESIN,
            accessToken,    
        };  
    }


}
