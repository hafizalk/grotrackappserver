import { HttpStatus } from '@nestjs/common';
import { UserDetailsDto } from 'src/user/dto/userdetails-dto';
import { User } from 'src/user/entity/user.entity';

export const toUserDetailsDto = (user: User): UserDetailsDto => {
  const userDto = new UserDetailsDto();
  userDto.email = user.email;
  userDto.firstName = user.firstName;
  userDto.userId = user.userId;
  userDto.surname = user.surname;

  return userDto;
};

export interface JwtPayload {
  email: string;
  userId: string;
}

export interface OperationStatus {
  success: boolean;
  message: string;
  httpStatus: HttpStatus;
}

export interface LoginStatus {
  email: string;
  token: any;
}
