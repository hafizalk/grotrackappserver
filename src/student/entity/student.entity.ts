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
import { Guardian } from 'src/guardian/entity/guardian.entity';
import { FeesPaymentStatus } from './feespaymentstatus.entity';

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


  @OneToMany(() => FeesPaymentStatus, (status) => status.student)
  @JoinColumn({ name: "statusId" })
  status: FeesPaymentStatus[];
}
