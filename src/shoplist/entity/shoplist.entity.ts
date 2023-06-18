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
  PrimaryColumn,
} from 'typeorm';

@Entity()
@Unique(['itemName', 'user'])
export class ShopList extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  itemName: string;

  @Column()
  purchaseDate: Date;

  @Column()
  restockDate: Date;

  @Column()
  itemBought: boolean;

  @Column()
  quantity: number;

  @ManyToOne(() => User, (user) => user.email)
  user: User;
}
