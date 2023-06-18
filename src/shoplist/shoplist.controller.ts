import {
  Body,
  Controller,
  HttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OperationStatus } from 'src/shared/helper';
import { AddShopListItemDto } from './dto/addshoplistitem-dto';
import { ShopListService } from './shoplist.service';

@Controller('student')
@UseGuards(AuthGuard())
export class ShopListController {
  constructor(private readonly studentService: ShopListService) {}

  @Post('addshoplistitem')
  public async addShopList(
    @Body() addshoplistitem: AddShopListItemDto,
  ): Promise<OperationStatus> {
    const result: OperationStatus =
      await this.studentService.addShopListForUser(addshoplistitem);
    if (!result.success) {
      throw new HttpException(result.message, result.httpStatus);
    }
    return result;
  }
}
