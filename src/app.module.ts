import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ShopListModule } from './shoplist/shoplist.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/scheduler.module';
import { EventsModule } from './events/events.module';
import { EventsGateway } from './events/events.gateway';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    ShopListModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`
    }),
    ScheduleModule.forRoot(),
    SchedulerModule,
    EventsModule,
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      defaults: {
        from: '"Do Not Reply" <lok8.noreply@gmail.com>',
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
