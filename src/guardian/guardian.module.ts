import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeesPaymentStatus } from './entity/feesPaymentStatus.entity';
import { Guardian } from './entity/guardian.entity';
import { Student } from './entity/student.entity';
import { FeesPaymentStatusService } from './feesPaymentStatus.service';
import { GuardianService } from './guardian.service';
import { StudentService } from './student.service';

@Module({
    imports: [TypeOrmModule.forFeature([Student, Guardian, FeesPaymentStatus])],
    exports: [GuardianService, StudentService, FeesPaymentStatusService],
})
export class GuardianModule {}
