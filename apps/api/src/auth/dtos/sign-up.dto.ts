import { IsString } from 'class-validator';

export class SignUpDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
