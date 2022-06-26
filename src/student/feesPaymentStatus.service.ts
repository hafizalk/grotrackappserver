import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddPaymentStatusDto } from 'src/guardian/dto/addpaymentstatus-dto';
import { OperationStatus, TermEnum } from 'src/shared/helper';
import { Repository } from 'typeorm';
import { FeesPaymentStatus } from './entity/feespaymentstatus.entity';
import { Student } from './entity/student.entity';
import { StudentService } from './student.service';

@Injectable()
export class FeesPaymentStatusService {
    
    constructor(
        @InjectRepository(FeesPaymentStatus)
        private feesPaymentStatusRepository: Repository<FeesPaymentStatus>,
        private studentService: StudentService
      ) {}
    
    async findFeesPaymentStatusForStudent(student: Student, term: TermEnum): Promise<FeesPaymentStatus> {
        return this.feesPaymentStatusRepository.findOne({ where: { student: student, term: term } });
    }
    
    async saveFeesPaymentStatus(feesPaymentStatus: FeesPaymentStatus): Promise<void> {
        // check if the fees payment exists in the db    
        const paymentStatus = await this.findFeesPaymentStatusForStudent(feesPaymentStatus.student, feesPaymentStatus.term);
        if (paymentStatus) {
            throw new HttpException('Fees Payment already exists for Student: '.concat(feesPaymentStatus.student.firstName).concat(" ").concat(feesPaymentStatus.student.surname), HttpStatus.BAD_REQUEST);    
        }
        await this.feesPaymentStatusRepository.save(feesPaymentStatus);
    }

    async addFeesPaymentForStudent(payments: AddPaymentStatusDto): Promise<OperationStatus> {
        let status: OperationStatus = null;
        
        try{
            const student = await this.studentService.findOneStudentWithName(payments.firstName, payments.surname);

            if (!student) {
                throw new HttpException('Student with following details does not exist: '.concat(student.firstName).concat(" ").concat(student.surname), HttpStatus.BAD_REQUEST);    
            }
            
            for (const payment of payments.payments) {
                payment.student = student;
                await this.saveFeesPaymentStatus(payment);
            };
            status = {
                success: true,
                message: 'Successfully saved fees payments for Student: '.concat(student.firstName).concat(" ").concat(student.surname),
                httpStatus: HttpStatus.CREATED
            };
        }
        catch(err){
            var errorStatus: HttpStatus;
            if(err instanceof HttpException){
                errorStatus = HttpStatus[HttpStatus[parseInt(err.getStatus().toString())]];
            }
            else{
                errorStatus = HttpStatus.INTERNAL_SERVER_ERROR;
            }
            status = {
                success: false,
                message: "Error saving fees payments for student with details: ".concat(payments.firstName).concat(" ").concat(payments.surname).concat(" ").concat(err),
                httpStatus: errorStatus
            };    
        }

        return status;
    }
}
