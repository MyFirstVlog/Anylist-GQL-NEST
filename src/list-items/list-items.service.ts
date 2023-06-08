import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { Repository } from 'typeorm';
import { List } from '../lists/entities/list.entity';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';

@Injectable()
export class ListItemsService {

  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>
  ){}

  async create(createListItemInput: CreateListItemInput) {
    const {listId, itemId, ...rest} = createListItemInput;

    const listItem = this.listItemRepository.create({
      ...rest,
      list: {id: listId},
      item: {id: itemId}
    }); 

    return await this.listItemRepository.save(listItem);
  }

  async findAll(list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs) {

    const {limit, offset} = paginationArgs;
    const {search} = searchArgs;

    const queryBuilder = this.listItemRepository.createQueryBuilder('listItem')
      .innerJoin('listItem.item', 'item')
      .take(limit)
      .skip(offset)
      .where(`"listId" = :listId`, {listId: list.id});

      if(search){
        queryBuilder.andWhere(`LOWER(item.name) like :name`, {name: `%${search.toLowerCase()}%`})
      }

      // queryBuilder.orderBy("name", "ASC");

    return queryBuilder.getMany();
    // return await this.listItemRepository.find();
  }

  async getItemlistcount(
    list: List
  ){
    const count = await this.listItemRepository.count({
      where: {
        list: {
          id: list.id
        }
      }
    });

    return count;
  }

  findOne(id: string) {
    const listItem = this.listItemRepository.findOneBy({id});

    if(!listItem) throw new NotFoundException(`list item with id ${id} not found`);

    return listItem;
  }

  async update(id: string, updateListItemInput: UpdateListItemInput) {
    const {listId, itemId, ...rest} = updateListItemInput;

    const queryBuilder = this.listItemRepository.createQueryBuilder()
      .update()
      .set(rest)
      .where('id = :id', {id});

    if(listId) queryBuilder.set({list: {id: listId}});
    if(itemId) queryBuilder.set({list: {id: itemId}});

    await queryBuilder.execute();

    return await this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }
}
