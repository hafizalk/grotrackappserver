import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { GuardianModule } from './guardian/guardian.module';

@Module({
  imports: [DatabaseModule, GuardianModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
