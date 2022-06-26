import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';
import { FeesPaymentStatus } from 'src/student/entity/feespaymentstatus.entity';
export class AddPaymentStatusDto {  
    @IsNotEmpty() @IsEmail()  email: string;
    @IsNotEmpty() firstName: string;
    @IsNotEmpty() surname: string;
    @IsArray() payments: FeesPaymentStatus[];
}