import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guardian } from './entity/guardian.entity';
import { GuardianService } from './guardian.service';

@Module({
    imports: [TypeOrmModule.forFeature([Guardian])],
    exports: [GuardianService],
    providers: [Guardian, GuardianService],
})
export class GuardianModule {}
