import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  BeforeInsert,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Student } from 'src/student/entity/student.entity';

@Entity()
@Unique(['email'])
export class Guardian extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  guardianId: string;

  @Column()
  firstName: string;
  
  @Column()
  surname: string;
  
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  contactNumber: string;

  @OneToMany(() => Student, (student) => student.guardian)
  @JoinColumn({ name: "studentId" })
  students: Student[];
  
  @BeforeInsert()  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);  
  }

  async validatePassword(plainPassword: string, hashPassword: string): Promise<boolean> {

    var result: boolean = false;
    
    result = await bcrypt.compare(plainPassword, hashPassword);
    
    return result;
  }
}
