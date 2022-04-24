import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Student } from './student.entity';

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

  @OneToMany((type) => Student, (student) => student.guardianId)
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
