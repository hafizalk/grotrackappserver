import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './../auth/auth.module';
import { UserModule } from './../user/user.module';
import { ShopList } from './entity/shoplist.entity';
import { ShopListController } from './shoplist.controller';
import { ShopListService } from './shoplist.service';

@Module({
  imports: [AuthModule, UserModule, TypeOrmModule.forFeature([ShopList])],
  exports: [ShopListService],
  providers: [ShopListService],
  controllers: [ShopListController],
})
export class ShopListModule {}
