import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { toUserDetailsDto } from 'src/shared/helper';
import { Repository } from 'typeorm';
import { AuthCredDto } from './dto/auth-cred-dto';
import { CreateUserDto } from './dto/newuser-dto';
import { UserDetailsDto } from './dto/userdetails-dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private user: User,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneUser(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async deleteUser(email: string): Promise<void> {
    await this.userRepository.delete(email);
  }

  async saveUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }

  async findByLogin(loginUser: AuthCredDto): Promise<UserDetailsDto> {
    const user: User = await this.findOneUser(loginUser.email);

    if (!user) return null;

    const isValidPassword = await this.user.validatePassword(
      loginUser.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return toUserDetailsDto(user);
  }

  async createNewUser(userDto: CreateUserDto): Promise<UserDetailsDto> {
    const { email, password, firstName, surname } = userDto;
    // check if the user exists in the db
    const userInDb = await this.findOneUser(email);
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const user: User = await this.userRepository.create({
      email,
      password,
      firstName,
      surname,
    });
    await this.saveUser(user);
    return toUserDetailsDto(user);
  }
}
