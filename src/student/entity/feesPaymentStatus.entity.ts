import { TermEnum } from 'src/shared/helper';
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
@Unique(['term', 'student'])
export class FeesPaymentStatus extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  statusId: string;
  
  @ManyToOne(() => Student, (student) => student.status)
  student: Student;

  @Column()
  term: TermEnum;

  @Column()
  paymentStatus: Boolean;

  @Column()
  academicYear: String;

  @Column()
  academicYearStart: Date;

  @Column()
  academicYearEnd: Date;

}
