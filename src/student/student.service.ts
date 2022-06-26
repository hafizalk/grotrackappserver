import { Injectable } from '@nestjs/common';
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
        let status: OperationStatus = {
            success: true,   
            message: 'Successfully saved students for Parent/Guardian: '.concat(addStudents.email),
            };
        const guardian = await this.guardianService.findOneGuardian(addStudents.email);
        console.log("Guardian ".concat(guardian.email))
        try{
            for (const student of addStudents.students) {
                student.guardian = guardian;
                this.saveStudent(student);
            };
        }
        catch(err){
            status = {
                success: false, 
                message: "Error saving student for parent with details: ".concat(addStudents.email).concat(err),
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
        await this.studentRepository.save(student);
    }
}
