import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeesPaymentStatus } from './entity/FeesPaymentStatus.entity';

@Injectable()
export class FeesPaymentStatusService {
    
    constructor(
        @InjectRepository(FeesPaymentStatus)
        private feesPaymentStatusRepository: Repository<FeesPaymentStatus>,
      ) {}
    
    async findFeesPaymentStatusForStudent(studentId: string): Promise<FeesPaymentStatus> {
        return this.feesPaymentStatusRepository.findOne({ where: { studentId: studentId } });
    }
    
    async saveFeesPaymentStatus(feesPaymentStatus: FeesPaymentStatus): Promise<void> {
        await this.feesPaymentStatusRepository.save(feesPaymentStatus);
    }
}
