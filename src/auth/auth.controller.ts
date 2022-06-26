import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthCredDto } from 'src/guardian/dto/auth-cred-dto';
import { CreateUserDto } from 'src/guardian/dto/newuser-dto';
import { LoginStatus, OperationStatus } from 'src/shared/helper';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Post('signup')  
    public async signUp(@Body() createUserDto: CreateUserDto,  ): Promise<OperationStatus> {    
        const result: OperationStatus = await this.authService.signUp(createUserDto);
        if (!result.success) {
            throw new HttpException(result.message, HttpStatus.BAD_REQUEST);    
        }
        return result;  
    }
    
    @Post('login')  
    public async login(@Body() loginUser: AuthCredDto): Promise<LoginStatus> {
        return await this.authService.login(loginUser);
    }
}
