import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { GuardianModule } from 'src/guardian/guardian.module';
import { Student } from './entity/student.entity';
import { FeesPaymentStatusService } from './feesPaymentStatus.service';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { FeesPaymentStatus } from './entity/feespaymentstatus.entity';

@Module({
    imports: [AuthModule, GuardianModule, TypeOrmModule.forFeature([Student, FeesPaymentStatus])],
    exports: [StudentService, FeesPaymentStatusService],
    providers: [StudentService, FeesPaymentStatusService],
    controllers: [StudentController],
})
export class StudentModule {}
