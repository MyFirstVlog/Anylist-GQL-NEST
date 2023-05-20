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

  update(id: number, updateItemInput: UpdateItemInput) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
