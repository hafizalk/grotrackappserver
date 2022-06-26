import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { GuardianModule } from './guardian/guardian.module';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DatabaseModule, GuardianModule, AuthModule, StudentModule, 
    ConfigModule.forRoot({
    isGlobal: true,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
