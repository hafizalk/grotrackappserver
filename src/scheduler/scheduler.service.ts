import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ShopList } from 'src/shoplist/entity/shoplist.entity';
import { ShopListService } from 'src/shoplist/shoplist.service';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private userService: UserService,
    private shopListService: ShopListService,
    private readonly mailerService: MailerService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleDailyMidnightCron() {
    this.logger.debug('Called every day at midnight');
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  handleDailyMorningCron() {
    this.sendRestockReminderEmails();
    this.logger.debug('Called every day at 8 am');
  }

  private async sendRestockReminderEmails() {
    let allUsers: User[] = await this.userService.findAllUsers();
    let todaysDate = new Date();
    allUsers.forEach(async (user) => {
      let shoplistItems: ShopList[] =
        await this.shopListService.findShopListsForUserId(user);
      const itemsDueForRestockReminder = shoplistItems.filter((item) => {
        let restockDate = new Date(item.restockDate);
        let restockReminderDays =
          item.restockReminderDays > 0 ? item.restockReminderDays : 1;
        let daysToRestock = Math.floor(
          (restockDate.getTime() - todaysDate.getTime()) / (24 * 3600 * 1000),
        );
        return daysToRestock + 1 == restockReminderDays ? true : false;
      });
      if (itemsDueForRestockReminder.length > 0) {
        this.mailerService
          .sendMail({
            to: user.email, // list of receivers
            from: 'lok8.noreply@gmail.com', // sender address
            subject: 'Grotrack: Reminder to Restock Items from Shopping List', // Subject line
            html: `<span>This is a reminder to restock the following items from your Shopping List. Have a lovely day</span>
            <ul>${itemsDueForRestockReminder
              .map((item) => `<li>${item.itemName}</li>`)
              .join('')}
               </ul>`, // HTML body content
          })
          .then(() => {
            console.log(`Sent a reminder to ${user.email} to restock items`);
          })
          .catch((err) => {
            console.log(err);
            console.log(`Error sending restock reminder for ${user.email}`);
          });
      }
    });
  }
}
