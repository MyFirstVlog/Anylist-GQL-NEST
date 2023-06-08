import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { ListItemsModule } from '../list-items/list-items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([List]),
    ListItemsModule
  ],
  providers: [ListsResolver, ListsService],
  exports: [ListsService, TypeOrmModule]
})
export class ListsModule {}
