import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../items/entities/item.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SEED_USERS, SEED_ITEMS, SEED_LISTS } from './data/seed-data';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';
import { ListItem } from '../list-items/entities/list-item.entity';
import { List } from '../lists/entities/list.entity';
import { ListItemsService } from '../list-items/list-items.service';
import { ListsService } from '../lists/lists.service';

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
    private readonly itemsService: ItemsService,
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
    private readonly listItemService: ListItemsService,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    private readonly listService: ListsService,
    
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

    const list = await this.loadLists(user);

    const items = await this.itemsService.findAll(user, {limit: 15, offset: 0}, {});

    await this.loadListItems(list, items);
    
    return true;
  }

  async loadLists(user: User): Promise<List>{

    const lists = SEED_LISTS.map(list => this.listService.create(list, user));

    await Promise.all(lists);

    return lists[0];
  }

  async loadListItems(list: List, items: Item[]){
    for (const item of items){
      this.listItemService.create({
        quantity: Math.round(Math.random() * 100),
        completed: Math.round(Math.random() * 1) === 0 ? false : true,
        listId: list.id,
        itemId: item.id
      });
    }
  }

  async deleteDatabase(){

    await this.listItemRepository.createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this.listRepository.createQueryBuilder()
      .delete()
      .where({})
      .execute();

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
