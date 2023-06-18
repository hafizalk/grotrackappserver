import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';
import { ShopList } from '../entity/shoplist.entity';

export class AddShopListItemDto {
  @IsNotEmpty() @IsEmail() email: string;
  @IsArray() shoplistItems: ShopList[];
}
