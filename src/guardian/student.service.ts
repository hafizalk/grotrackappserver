import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entity/Student.entity';

@Injectable()
export class StudentService {
    
    constructor(
        @InjectRepository(Student)
        private studentRepository: Repository<Student>,
      ) {}

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
