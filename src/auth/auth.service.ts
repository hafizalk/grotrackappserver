import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredDto } from 'src/guardian/dto/auth-cred-dto';
import { CreateUserDto } from 'src/guardian/dto/newuser-dto';
import { UserDetailsDto } from 'src/guardian/dto/userdetails-dto';
import { Guardian } from 'src/guardian/entity/guardian.entity';
import { GuardianService } from 'src/guardian/guardian.service';
import { JwtPayload, LoginStatus, OperationStatus, toUserDetailsDto } from 'src/shared/helper';

@Injectable()
export class AuthService {

    constructor(
        private readonly guardianService: GuardianService,
        private readonly jwtService: JwtService
    ) {}


    async signUp(userDto: CreateUserDto): Promise<OperationStatus> {
        let status: OperationStatus = {
            success: true,   
            message: 'Successfully registered user',
            httpStatus: HttpStatus.CREATED
        };
        try {
            await this.guardianService.createNewUser(userDto);
        } catch (err) {
            var httpStatus: HttpStatus;
            if(err instanceof HttpException){
                httpStatus = HttpStatus[HttpStatus[parseInt(err.getStatus.toString())]];
            }
            else{
                httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
            }
            status = {
                success: false, 
                message: "Error registering user: ".concat(err),
                httpStatus: httpStatus
            };    
        }
        return status;  
    }

    async validateUser(email: string): Promise<UserDetailsDto> {

        const guardian: Guardian = await this.guardianService.findOneGuardian(email);

        if (!guardian){
            throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);    
        }

        return toUserDetailsDto(guardian);
    }

    async login(loginUser: AuthCredDto): Promise<LoginStatus> {    
        // find user in db    
        const user = await this.guardianService.findByLogin(loginUser);
        // generate and sign token    
        const token = this._createToken(user);
        
        return {
            username: user.email, ...token,
        };  
    }
    
    private _createToken(userDetails: UserDetailsDto): any {
        const email = userDetails.email;
        const guardianId = userDetails.guardianId;
        const user: JwtPayload = { email, guardianId };
        const accessToken = this.jwtService.sign(user);
        return {
            expiresIn: process.env.EXPIRESIN,
            accessToken,    
        };
    }


}
