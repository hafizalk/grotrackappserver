import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { FeesPaymentStatus } from './feesPaymentStatus.entity';

@Entity()
@Unique(['firstName', 'surname'])
export class Student extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  studentId: string;

  @Column()
  firstName: string;
  
  @Column()
  surname: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  guardianId: string;

  @OneToMany((type) => FeesPaymentStatus, (status) => status.studentId)
  status: FeesPaymentStatus[];
}
