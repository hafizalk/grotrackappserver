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
import { ShopList } from 'src/shoplist/entity/shoplist.entity';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column()
  firstName: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => ShopList, (shopList) => shopList.user)
  @JoinColumn({ name: 'itemId' })
  shopList: ShopList[];

  @BeforeInsert() async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(
    plainPassword: string,
    hashPassword: string,
  ): Promise<boolean> {
    var result: boolean = false;

    result = await bcrypt.compare(plainPassword, hashPassword);

    return result;
  }
}
