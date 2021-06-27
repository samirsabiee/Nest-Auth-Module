import { IsString, NotEquals} from 'class-validator';

export class RegisterDto {
  @NotEquals(null)
  @IsString()
  username: string;

  @NotEquals(null)
  @IsString()
  password: string;

  @NotEquals(null)
  @IsString()
  retypePassword: string;
}
