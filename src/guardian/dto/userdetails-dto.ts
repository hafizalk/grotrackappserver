import { IsArray, IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import { Student } from 'src/student/entity/student.entity';
export class UserDetailsDto {
    @IsNotEmpty() guardianId: string;
    @IsNotEmpty() @IsEmail() email: string;
    @IsNotEmpty() firstName: string;
    @IsNotEmpty() surname: string;
    @IsNotEmpty() contactNumber: string;
    @IsArray() students: Student[];
}