import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OperationStatus } from 'src/shared/helper';
import { AddShopListItemDto } from './dto/addshoplistitem-dto';
import { ShopList } from './entity/shoplist.entity';
import { ShopListService } from './shoplist.service';

@Controller('shoplist')
@UseGuards(AuthGuard())
export class ShopListController {
  constructor(private readonly shopListService: ShopListService) {}

  @Post('addshoplistitem')
  public async addShopList(
    @Body() addshoplistitem: AddShopListItemDto,
  ): Promise<OperationStatus> {
    const result: OperationStatus =
      await this.shopListService.addShopListForUser(addshoplistitem);
    if (!result.success) {
      throw new HttpException(result.message, result.httpStatus);
    }
    return result;
  }

  @Get('getshoplistitems')
  public async getShopListItems(@Headers() headers): Promise<ShopList[]> {
    let email = headers.userid;
    return this.shopListService.findAllShopListItemsForUser(email);
  }

  @Post('updateshoplistitem')
  public async updateShopListItem(
    @Body() item: ShopList,
  ): Promise<OperationStatus> {
    const result: OperationStatus = await this.shopListService.updateItem(item);
    if (!result.success) {
      throw new HttpException(result.message, result.httpStatus);
    }
    return result;
  }

  @Delete('removeshoplistitem/:id')
  public async removeShopListItem(
    @Param('id') id: string,
  ): Promise<OperationStatus> {
    const result: OperationStatus =
      await this.shopListService.removeShopListItem(id);
    if (!result.success) {
      throw new HttpException(result.message, result.httpStatus);
    }
    return result;
  }
}
