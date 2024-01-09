import { User } from './../../user/entity/user.entity';
import {
  BaseEntity,
  Entity,
  Column,
  Unique,
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

  @Column()
  restockReminderDays: number;

  @ManyToOne(() => User, (user) => user.email)
  user: User;
}
