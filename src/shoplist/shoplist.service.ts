import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { OperationStatus } from '../shared/helper';
import { AddShopListItemDto } from './dto/addshoplistitem-dto';
import { ShopList } from './entity/shoplist.entity';

@Injectable()
export class ShopListService {
  constructor(
    @InjectRepository(ShopList)
    private shopListRepository: Repository<ShopList>,
    private userService: UserService,
  ) {}

  async addShopListForUser(
    addshoplistitem: AddShopListItemDto,
  ): Promise<OperationStatus> {
    let status: OperationStatus = null;

    try {
      const user = await this.userService.findOneUser(addshoplistitem.email);
      if (!user) {
        throw new HttpException(
          'User with following details does not exist: '.concat(
            addshoplistitem.email,
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
      for (const item of addshoplistitem.shoplistItems) {
        item.user = user;
        await this.saveShopListItem(item);
      }
      status = {
        success: true,
        message: 'Successfully saved shop list item for User: '.concat(
          addshoplistitem.email,
        ),
        httpStatus: HttpStatus.CREATED,
      };
    } catch (err) {
      var errorStatus: HttpStatus;
      if (err instanceof HttpException) {
        errorStatus =
          HttpStatus[HttpStatus[parseInt(err.getStatus().toString())]];
      } else {
        errorStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      }
      status = {
        success: false,
        message: 'Error saving shop list item for user with details: '
          .concat(addshoplistitem.email)
          .concat(' ')
          .concat(err),
        httpStatus: errorStatus,
      };
    }

    return status;
  }

  async findAllShopLists(): Promise<ShopList[]> {
    return this.shopListRepository.find();
  }

  async findOneShopListWithNameAndUserId(
    itemName: string,
    userId: string,
  ): Promise<ShopList> {
    return this.shopListRepository.findOne({ where: { itemName, userId } });
  }

  async findOneShopListWithId(itemId: string): Promise<ShopList> {
    return this.shopListRepository.findOne({ where: { itemId } });
  }

  async findShopListsForUserId(userId: string): Promise<ShopList[]> {
    return this.shopListRepository.find({ where: { userId } });
  }

  async deleteShopList(itemName: string, userId: string): Promise<void> {
    await this.shopListRepository.delete([itemName, userId]);
  }

  async saveShopListItem(item: ShopList): Promise<void> {
    // check if the student exists in the db
    const itemExistsForUser = await this.findOneShopListWithNameAndUserId(
      item.itemName,
      item.user.userId,
    );
    if (itemExistsForUser) {
      throw new HttpException(
        'ShopList item already exists for user',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.shopListRepository.save(item);
  }
}
