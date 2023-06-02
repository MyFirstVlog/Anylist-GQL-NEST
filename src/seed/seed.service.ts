import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../items/entities/item.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SEED_USERS, SEED_ITEMS } from './data/seed-data';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';

@Injectable()
export class SeedService {
    isProd: boolean;

  constructor(
    private readonly configService :ConfigService,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService
  ) {
    this.isProd = this.configService.get('STATE') === 'prod';
  }

  async executeSeed(){

    //? Routes protection
    if(this.isProd) throw new UnauthorizedException('Seeds are not available on prod');

    //? Delete database

    await this.deleteDatabase();

    //? Create users

    const user = await this.createUsers();

    await this.loadItems(user);
    
    return true;
  }

  async deleteDatabase(){

    await this.itemsRepository.createQueryBuilder()
    .delete()
    .where({})
    .execute();

    await this.usersRepository.createQueryBuilder()
    .delete()
    .where({})
    .execute();
  }

  async createUsers(){

    const users = SEED_USERS.map((user) => this.usersService.create(user));

    await Promise.all(users);

    return users[0];
  }

  async loadItems ( user: User) {
    const items = SEED_ITEMS.map((item) => this.itemsService.create(item, user));

    await Promise.all(items);
  }
}
