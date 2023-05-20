import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput} from './dto/inputs';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ){}

  async create(createItemInput: CreateItemInput) {
    const item = this.itemRepository.create(createItemInput);
    const itemSaved = await this.itemRepository.save(item);
    console.log({itemSaved});
    return itemSaved;
  }

  findAll() {
    return this.itemRepository.find();
  }

  async findOne(id: string) {
    const item = await this.itemRepository.findOneBy({id});

    if(!item) throw new NotFoundException(`item with id ${id} not found`);

    return item;
  }

  async update(updateItemInput : UpdateItemInput) {
    const item = await this.itemRepository.preload(updateItemInput); //* Automatically search inside the object for an ID --> where({id})

    if(!item) throw new NotFoundException(`item with id ${updateItemInput.id} not found`);

    return await this.itemRepository.save(item);
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    await this.itemRepository.delete(id); //* remove through criteria
    // await this.itemRepository.remove(item); //* remove through entities
    return {...item, id};
  }
}
