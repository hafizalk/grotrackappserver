import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddStudentsDto } from 'src/guardian/dto/addstudents-dto';
import { GuardianService } from 'src/guardian/guardian.service';
import { Repository } from 'typeorm';
import { OperationStatus } from '../shared/helper';
import { Student } from './entity/student.entity';

@Injectable()
export class StudentService {
    
    
    constructor(
        @InjectRepository(Student)
        private studentRepository: Repository<Student>,
        private guardianService: GuardianService
      ) {}


    async addStudentForGuardian(addStudents: AddStudentsDto): Promise<OperationStatus> {
        let status: OperationStatus = null;
        
        try{
            const guardian = await this.guardianService.findOneGuardian(addStudents.email);
            if (!guardian) {
                throw new HttpException('Parent/Guardian with following details does not exist: '.concat(guardian.email), HttpStatus.BAD_REQUEST);    
            }
            for (const student of addStudents.students) {
                student.guardian = guardian;
                await this.saveStudent(student);
            };
            status = {
                success: true,
                message: 'Successfully saved students for Parent/Guardian: '.concat(addStudents.email),
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
                message: "Error saving students for parent with details: ".concat(addStudents.email).concat(" ").concat(err),
                httpStatus: errorStatus
            };    
        }

        return status;
    }

    async findAllStudents(): Promise<Student[]> {
        return this.studentRepository.find();
    }
    
    async findOneStudentWithName(firstName: string, surname: string): Promise<Student> {
        return this.studentRepository.findOne({ where: { firstName: firstName, surname: surname } });
    }

    async findOneStudentWithId(studentId: string): Promise<Student> {
        return this.studentRepository.findOne({ where: { studentId: studentId } });
    }

    async findStudentsForGuardianId(guardianId: string): Promise<Student[]> {
        return this.studentRepository.find({ where: { guardianId: guardianId } });
    }
    
    async deleteStudent(firstName: string, surname: string): Promise<void> {
        await this.studentRepository.delete([firstName, surname]);
    }
    
    async saveStudent(student: Student): Promise<void> {
        // check if the student exists in the db    
        const studentInDb = await this.findOneStudentWithName(student.firstName, student.surname);
        if (studentInDb) {
            throw new HttpException('Student already exists', HttpStatus.BAD_REQUEST);    
        }
        await this.studentRepository.save(student);
    }
}
