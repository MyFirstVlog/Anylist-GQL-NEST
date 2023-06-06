import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput} from './dto/inputs';
import { Like, Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ){}

  async create(createItemInput: CreateItemInput, user: User) {
    const item = this.itemRepository.create({
      ...createItemInput,
      user
    });
    const itemSaved = await this.itemRepository.save(item);
    console.log({itemSaved});
    return itemSaved;
  }

  findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs) {
    console.log("user id", user.id);

    const {limit, offset} = paginationArgs;
    const {search} = searchArgs;

    // return this.itemRepository.findBy({
    //   user: {
    //     id: user.id
    //   }
    // });

    console.log({limit, offset})

    const queryBuilder = this.itemRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, {userId: user.id});

      if(search){
        queryBuilder.andWhere(`LOWER(name) like :name`, {name: `%${search.toLowerCase()}%`})
      }

      // queryBuilder.orderBy("name", "ASC");

    return queryBuilder.getMany();

    //* They both work
    // return this.itemRepository.find({
    //   take: limit,
    //   skip: offset,
    //   where: {
    //     user: {
    //       id: user.id
    //     },
    //     name: Like(`%${search}%`)
    //   },
    //   order: {
    //     name: 'ASC'
    //   }
    // });

    return 
  }

  async findOne(id: string, user: User) {
    const item = await this.itemRepository.findOneBy({
      id,
      user: {
        id: user.id
      }
    });

    if(!item) throw new NotFoundException(`item with id ${id} not found`);

    return item;
  }

  async update(updateItemInput : UpdateItemInput, user: User) {
    await this.findOne(updateItemInput.id, user);
    
    const item = await this.itemRepository.preload(updateItemInput); //* Automatically search inside the object for an ID --> where({id})

    if(!item) throw new NotFoundException(`item with id ${updateItemInput.id} not found`);

    return await this.itemRepository.save(item);
  }

  async remove(id: string, user: User) {
    const item = await this.findOne(id, user);
    await this.itemRepository.delete(id); //* remove through criteria
    // await this.itemRepository.remove(item); //* remove through entities
    return {...item, id};
  }

  async itemsFromUser(user: User): Promise<number> {
    const count = this.itemRepository.count({
      where: {
        user: {
          id: user.id
        }
      }
    });
    return count;
  }
}
