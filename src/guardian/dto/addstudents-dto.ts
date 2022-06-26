import { IsArray, IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import { Student } from 'src/student/entity/student.entity';
export class AddStudentsDto {  
    @IsNotEmpty() @IsEmail()  email: string;
    @IsArray() students: Student[];
}