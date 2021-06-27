import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async register(registerDto: RegisterDto) {
    const { username, password } = registerDto;
    if (await this.isExist(username)) {
      throw new BadRequestException(
        'Bad input data change username or password',
      );
    } else {
      return await this.save({
        username,
        password,
      });
    }
  }
  async isExist(username): Promise<boolean> {
    try {
      const user = await this.findOne({ username });
      return !!user;
    } catch (e) {
      console.log(e);
    }
  }
}
