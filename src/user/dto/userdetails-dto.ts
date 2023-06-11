import { IsEmail, IsNotEmpty } from 'class-validator';
export class UserDetailsDto {
  @IsNotEmpty() userId: string;
  @IsNotEmpty() @IsEmail() email: string;
  @IsNotEmpty() firstName: string;
  @IsNotEmpty() surname: string;
}
