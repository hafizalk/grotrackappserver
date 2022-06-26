import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
} from 'typeorm';
import { Student } from './student.entity';

@Entity()
@Unique(['statusId', 'academicYear'])
export class FeesPaymentStatus extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  statusId: string;
  
  @ManyToOne(() => Student, (student) => student.status)
  student: Student;

  @Column()
  termOneStatus: boolean;
  
  @Column()
  termTwoStatus: boolean;

  @Column()
  termThreeStatus: boolean;

  @Column()
  academicYear: String;

  @Column()
  academicYearStart: Date;

  @Column()
  academicYearEnd: Date;

}
