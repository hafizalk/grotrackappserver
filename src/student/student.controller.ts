import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AddPaymentStatusDto } from 'src/guardian/dto/addpaymentstatus-dto';
import { AddStudentsDto } from 'src/guardian/dto/addstudents-dto';
import { OperationStatus } from 'src/shared/helper';
import { FeesPaymentStatusService } from './feesPaymentStatus.service';
import { StudentService } from './student.service';

@Controller('student')
@UseGuards(AuthGuard())
export class StudentController {

    constructor(private readonly studentService: StudentService,
        private readonly feesPaymentService: FeesPaymentStatusService) {}

    @Post('addstudentward')
    public async addStudent(@Body() addStudents: AddStudentsDto): Promise<OperationStatus> {
        const result: OperationStatus = await this.studentService.addStudentForGuardian(addStudents);
        if (!result.success) {
            throw new HttpException(result.message, result.httpStatus);
        }
        return result;
    }

    @Post('addpaymentstatus')
    public async addFeesPaymentForStudent(@Body() payments: AddPaymentStatusDto): Promise<OperationStatus> {
        const result: OperationStatus = await this.feesPaymentService.addFeesPaymentForStudent(payments);
        if (!result.success) {
            throw new HttpException(result.message, result.httpStatus);
        }
        return result;
    }
}

