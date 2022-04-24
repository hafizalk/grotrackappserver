import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { toUserDetailsDto } from 'src/shared/helper';
import { Repository } from 'typeorm';
import { AuthCredDto } from './dto/auth-cred-dto';
import { CreateUserDto } from './dto/newuser-dto';
import { UserDetailsDto } from './dto/userdetails-dto';
import { Guardian } from './entity/guardian.entity';
import { Student } from './entity/student.entity';

@Injectable()
export class GuardianService {
    
    constructor(
        @InjectRepository(Guardian)
        private guardianRepository: Repository<Guardian>,
        private guardian: Guardian,
      ) {}

    async findAllGuardians(): Promise<Guardian[]> {
        return this.guardianRepository.find();
    }
    
    async findOneGuardian(email: string): Promise<Guardian> {
        return this.guardianRepository.findOne({ where: { email: email } });
    }
    
    async deleteGuardian(email: string): Promise<void> {
        await this.guardianRepository.delete(email);
    }
    
    async saveGuardian(guardian: Guardian): Promise<void> {
        await this.guardianRepository.save(guardian);
    }

    async findByLogin(loginUser: AuthCredDto): Promise<UserDetailsDto> {

        const guardian: Guardian = await this.findOneGuardian(loginUser.email);

        if (!guardian) return null;

        const isValidPassword = await this.guardian.validatePassword(loginUser.password, guardian.password);

        console.log(isValidPassword);

        if (!isValidPassword) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);    
        }

        return toUserDetailsDto(guardian);
    }

    async createNewUser(userDto: CreateUserDto): Promise<UserDetailsDto> {    
        const { email, password, firstName, surname, contactNumber, students  } = userDto;
        // check if the user exists in the db    
        const userInDb = await this.findOneGuardian(email);
        if (userInDb) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);    
        }
        
        const guardian: Guardian = await this.guardianRepository.create({ email, password, firstName, surname, contactNumber, students  });
        await this.saveGuardian(guardian);
        return toUserDetailsDto(guardian);
    }
}
