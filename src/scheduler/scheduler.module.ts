import { Module } from '@nestjs/common';
import { ShopListModule } from 'src/shoplist/shoplist.module';
import { SchedulerService } from './scheduler.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from 'src/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    ShopListModule,
    MailerModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 25,
          secure: false,
          auth: {
            type: 'Gmail',
            user: 'lok8.noreply@gmail.com',
            pass: configService.get('NO_REPLY_PASS'),
          },
        },
        defaults: {
          from: '"Do Not Reply" <lok8.noreply@gmail.com>',
        },
      }),
    }),
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}
