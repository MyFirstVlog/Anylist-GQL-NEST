import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from '../auth/dto/input/signup.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'
import { LoginInput } from '../auth/dto/input';
import { ValidRoles } from '../auth/enums/valid-roles.enum';


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

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    
    if(roles.length === 0) 
      return this.userRepository
        .find();
        // .find({
        //   relations:{
        //     lastUpdatedBy: true,
        //   }
        // });

    const queryBuilder = this.userRepository.createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany();

    return queryBuilder;
  }

  findOne(id: string): Promise<User> {
    throw new Error(`User ${id} not found`);
  }

  async update(id: string, updateUserInput: UpdateUserInput, userAdmin: User): Promise<User> {

    try {

      let user = await this.userRepository.preload({
        ...updateUserInput,
        id
      });

      console.log({userAdmin});
      
      user.lastUpdatedBy = userAdmin;

      return await this.userRepository.save(user);
      
    } catch (error) {
      this.handleDbErrors(error)
    }

  }

  async block(id: string, currentUser: User): Promise<User> {
    const user = await this.findOneById(id);

    user.isActive = false;
    user.lastUpdatedBy = currentUser;

    return await this.userRepository.save(user);
  }

  async findOneByEmail(loginInput: LoginInput){
    try {
      const user = await this.userRepository.findOneBy({email: loginInput.email});

      if(user) return user;

      throw new NotFoundException(`User with email ${loginInput.email} not found`)

    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async findOneById(id: string){
    try {
      const user = await this.userRepository.findOneBy({id});

      if(user) return user;

      throw new NotFoundException(`User with id ${id} not found`)

    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  private handleDbErrors(error: any): never{
    if(error.code  === '23505') throw new BadRequestException(error.detail.replace('Key', '')); //* Errores propios de postgres

    this.logger.error(error)

    throw new InternalServerErrorException('Check server logs for error details');
  }
}
