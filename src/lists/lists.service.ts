import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { StringArraySupportOption } from 'prettier';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';

@Injectable()
export class ListsService {

  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>
  ){}

  async create(createListInput: CreateListInput, user: User) {

    const list = await this.listRepository.create(createListInput);

    list.user = user;

    return await this.listRepository.save(list);
  }

  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs) {

    const {limit, offset} = paginationArgs;
    const {search} = searchArgs;

    // return await this.listRepository.find({
    //  where: {
    //   user: {
    //     id: user.id
    //   }
    //  } 
    // });

    const queryBuilder = this.listRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, {userId: user.id});

      if(search){
        queryBuilder.andWhere(`LOWER(name) like :name`, {name: `%${search.toLowerCase()}%`})
      }

      // queryBuilder.orderBy("name", "ASC");

    return queryBuilder.getMany();
  }

  async findOne(id: string, user: User) {
    const list = await this.listRepository.findOne({
      where: {
        id,
        user: {
          id: user.id
        }
      }
     });

     if(!list) throw new NotFoundException(`list with id ${id} not found`);

     return list;
  }

  async update(id: string, updateListInput: UpdateListInput, user: User) {
    await this.findOne(updateListInput.id, user);

    const list = await this.listRepository.preload(updateListInput);

    if(!list) throw new NotFoundException(`list with id ${updateListInput.id} not found`);

    return await this.listRepository.save(list);
  }

  async remove(id: string, user: User) {
    const list = await this.findOne(id, user);

    const listRemoved = await this.listRepository.remove(list);

    return {...listRemoved,user, id};
  }
}
