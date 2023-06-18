import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredDto } from 'src/user/dto/auth-cred-dto';
import { CreateUserDto } from 'src/user/dto/newuser-dto';
import { UserDetailsDto } from 'src/user/dto/userdetails-dto';
import { User } from 'src/user/entity/user.entity';
import { ShopListService } from 'src/user/user.service';
import {
  JwtPayload,
  LoginStatus,
  OperationStatus,
  toUserDetailsDto,
} from 'src/shared/helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly shopListService: ShopListService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(userDto: CreateUserDto): Promise<OperationStatus> {
    let status: OperationStatus = {
      success: true,
      message: 'Successfully registered user',
      httpStatus: HttpStatus.CREATED,
    };
    try {
      await this.shopListService.createNewUser(userDto);
    } catch (err) {
      var httpStatus: HttpStatus;
      if (err instanceof HttpException) {
        httpStatus =
          HttpStatus[HttpStatus[parseInt(err.getStatus().toString())]];
      } else {
        httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      }
      status = {
        success: false,
        message: 'Error registering user: '.concat(err),
        httpStatus: httpStatus,
      };
    }
    return status;
  }

  async validateUser(email: string): Promise<UserDetailsDto> {
    const user: User = await this.shopListService.findOneUser(email);

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    return toUserDetailsDto(user);
  }

  async login(loginUser: AuthCredDto): Promise<LoginStatus> {
    // find user in db
    const user = await this.shopListService.findByLogin(loginUser);
    // generate and sign token
    const token = this._createToken(user);

    return {
      username: user.email,
      ...token,
    };
  }

  private _createToken(userDetails: UserDetailsDto): any {
    const email = userDetails.email;
    const userId = userDetails.userId;
    const user: JwtPayload = { email, userId };
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn: process.env.EXPIRESIN,
      accessToken,
    };
  }
}
