import { User } from 'src/user/entity/user.entity';
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

@Entity()
@Unique(['itemName', 'user'])
export class ShopList extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  itemId: string;

  @Column()
  itemName: string;
  
  @Column()
  surname: string;

  @Column()
  puurchaseDate: Date;

  @Column()
  restockDate: Date;

  @ManyToOne(() => User, (user) => user.email)
  user: User;
}
