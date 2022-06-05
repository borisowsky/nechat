import { IsString } from 'class-validator';

export class GetUserDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
