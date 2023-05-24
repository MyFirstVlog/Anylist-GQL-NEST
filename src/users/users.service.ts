import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from '../auth/dto/input/signup.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {

  private logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async create(signupInput: SignupInput) {

    try {
      const user = this.userRepository.create(signupInput);

      return await this.userRepository.save({
        ...user,
        password: bcrypt.hashSync(user.password, 10)
      });
      
    } catch (error) {
      this.handleDbErrors(error);
    }

  }

  async findAll(): Promise<User[]> {
    return [];
  }

  findOne(id: string): Promise<User> {
    throw new Error(`User ${id} not found`);
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  block(id: string): Promise<User> {
    throw new Error(`User ${id} not found`);
  }

  private handleDbErrors(error: any): never{

    this.logger.error(error)

    if(error.code  === '23505') throw new BadRequestException(error.detail.replace('Key', ''));

    throw new InternalServerErrorException('Check server logs for error details');
  }
}
