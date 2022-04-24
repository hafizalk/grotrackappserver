import { IsArray, IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import { Student } from '../entity/student.entity';
export class CreateUserDto {  
    @IsNotEmpty() 
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'password too weak' },
    )
    password: string;
    @IsNotEmpty() @IsEmail()  email: string;
    @IsNotEmpty() firstName: string;
    @IsNotEmpty() surname: string;
    @IsNotEmpty() contactNumber: string;
    @IsArray() students: Student[];
}