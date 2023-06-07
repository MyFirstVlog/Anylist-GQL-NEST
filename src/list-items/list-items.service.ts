import { Injectable } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { Repository } from 'typeorm';

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

  async findAll() {
    return await this.listItemRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} listItem`;
  }

  update(id: number, updateListItemInput: UpdateListItemInput) {
    return `This action updates a #${id} listItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }
}
