import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AddStudentsDto } from 'src/guardian/dto/addstudents-dto';
import { OperationStatus } from 'src/shared/helper';
import { StudentService } from './student.service';

@Controller('student')
@UseGuards(AuthGuard())
export class StudentController {

    constructor(private readonly studentService: StudentService) {}

    @Post('addstudentward')
    public async addStudent(@Body() addStudents: AddStudentsDto): Promise<OperationStatus> {
        console.log("Guardian ".concat(addStudents.email))
        const result: OperationStatus = await this.studentService.addStudentForGuardian(addStudents);
        if (!result.success) {
            throw new HttpException(result.message, HttpStatus.INTERNAL_SERVER_ERROR);    
        }
        return result;
    }
}

