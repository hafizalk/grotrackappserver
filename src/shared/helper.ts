import { HttpStatus } from "@nestjs/common";
import { UserDetailsDto } from "src/guardian/dto/userdetails-dto";
import { Guardian } from "src/guardian/entity/guardian.entity";

export const toUserDetailsDto = (guardian: Guardian): UserDetailsDto => {  
    const user = new UserDetailsDto();
    user.email = guardian.email;
    user.contactNumber = guardian.contactNumber;
    user.firstName = guardian.firstName;
    user.guardianId = guardian.guardianId;
    user.surname = guardian.surname;
    user.students = guardian.students;

    return user;
};

export interface JwtPayload {  email: string; guardianId: string;}

export interface OperationStatus {  
    success: boolean;  
    message: string;
    httpStatus: HttpStatus;
}

export interface LoginStatus {  
    email: string;  
    token: any;
}

export declare enum TermEnum {
    Term1 = 1,
    Term2 = 2,
    Term3 = 3
}