import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleDailyMidnightCron() {
    this.logger.debug('Called every day at midnight');
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  handleDailyMorningCron() {
    this.logger.debug('Called every day at 10 am');
  }
}
