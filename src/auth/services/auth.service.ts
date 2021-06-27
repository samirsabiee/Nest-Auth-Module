import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AuthRepository } from '../repositories/auth.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository) private authRepository: AuthRepository,
  ) {}

  async register(registerDto) {
    const { password, retypePassword } = registerDto;
    if (!this.samePasswords(password, retypePassword))
      throw new BadRequestException(
        'Bad input data change username or password',
      );
    registerDto.password = await this.hashPassword(password);
    delete registerDto.retypePassword;
    return this.authRepository.register(registerDto);
  }
  async hashPassword(password): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
  samePasswords(password, retypePassword) {
    return password === retypePassword;
  }
}
