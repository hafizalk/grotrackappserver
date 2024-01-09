import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './../user/entity/user.entity';
import { UserService } from './../user/user.service';
import { Repository, IsNull, Equal } from 'typeorm';
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
    user: User,
  ): Promise<ShopList> {
    return this.shopListRepository.findOne({
      where: { itemName: itemName, user: Equal(user.userId) },
    });
  }

  async findOneShopListWithId(itemId: string): Promise<ShopList> {
    return this.shopListRepository.findOne({ where: { id: itemId } });
  }

  async findShopListsForUserId(user: User): Promise<ShopList[]> {
    return this.shopListRepository.find({
      where: { user: Equal(user.userId) },
    });
  }

  async findAllShopListItemsForUser(email: string): Promise<ShopList[]> {
    const user: User = await this.userService.findOneUser(email);
    return this.findShopListsForUserId(user);
  }

  async deleteShopList(itemId: string): Promise<void> {
    await this.shopListRepository.delete(itemId);
  }

  async removeShopListItem(id: string): Promise<OperationStatus> {
    let status: OperationStatus = null;
    try {
      this.deleteShopList(id);
      status = {
        success: true,
        message: 'Successfully saved shop list item for User',
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
        message: 'Error saving shop list item for user with details: '.concat(
          err,
        ),
        httpStatus: errorStatus,
      };
    }
    return status;
  }

  async updateItem(item: ShopList): Promise<OperationStatus> {
    let status: OperationStatus = null;
    try {
      this.shopListRepository.update(item.id, {
        purchaseDate: item.purchaseDate,
        restockDate: item.restockDate,
        itemBought: item.itemBought,
        quantity: item.quantity,
      });
      status = {
        success: true,
        message: 'Successfully saved shop list item for User',
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
        message: 'Error saving shop list item for user with details: '.concat(
          err,
        ),
        httpStatus: errorStatus,
      };
    }
    return status;
  }

  async saveShopListItem(item: ShopList): Promise<void> {
    // check if the item exists in the db
    const itemExistsForUser = await this.findOneShopListWithNameAndUserId(
      item.itemName,
      item.user,
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
