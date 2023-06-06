import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { StringArraySupportOption } from 'prettier';

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

  async findAll(user: User) {
    return await this.listRepository.find({
     where: {
      user: {
        id: user.id
      }
     } 
    });
  }

  async findOne(id: string, user: User) {
    console.log("en el findOneeeee",{id, user});
    
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

  update(id: number, updateListInput: UpdateListInput) {
    return `This action updates a #${id} list`;
  }

  remove(id: number) {
    return `This action removes a #${id} list`;
  }
}
