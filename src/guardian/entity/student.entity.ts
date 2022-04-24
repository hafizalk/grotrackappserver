import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { FeesPaymentStatus } from './feesPaymentStatus.entity';
import { Guardian } from './guardian.entity';

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

  @ManyToOne(() => Guardian, (guardian) => guardian.students)
  guardian: Guardian;


  @OneToMany((type) => FeesPaymentStatus, (status) => status.student)
  @JoinColumn({ name: "statusId" })
  status: FeesPaymentStatus[];
}
