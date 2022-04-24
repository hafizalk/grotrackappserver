import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  BeforeInsert,
} from 'typeorm';

@Entity()
@Unique(['studentId', 'academicYear'])
export class FeesPaymentStatus extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  guardianId: string;

  @Column()
  studentId: string;

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
