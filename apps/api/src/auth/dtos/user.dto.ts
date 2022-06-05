import { Expose } from 'class-transformer';

export class UserDTO {
  @Expose()
  id: string;

  @Expose()
  username: string;
}
