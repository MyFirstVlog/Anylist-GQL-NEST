import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ListItemsService } from './list-items.service';
import { ListItem } from './entities/list-item.entity';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';

@Resolver(() => ListItem)
@UseGuards(JwtAuthGuard)
export class ListItemsResolver {
  constructor(private readonly listItemsService: ListItemsService) {}

  @Mutation(() => ListItem)
  createListItem(@Args('createListItemInput') createListItemInput: CreateListItemInput) {
    return this.listItemsService.create(createListItemInput);
  }

  // @Query(() => [ListItem], { name: 'listItems' })
  // findAll() {
  //   // return this.listItemsService.findAll();
  // }

  @Query(() => ListItem, { name: 'findOneListItem' })
  findOne(@Args('id', { type: () => String }) id: string): Promise<ListItem> {
    return this.listItemsService.findOne(id);
  }

  @Mutation(() => ListItem)
  updateListItem(@Args('updateListItemInput') updateListItemInput: UpdateListItemInput) {
    return this.listItemsService.update(updateListItemInput.id, updateListItemInput);
  }

  // @Mutation(() => ListItem)
  // removeListItem(@Args('id', { type: () => Int }) id: number) {
  //   return this.listItemsService.remove(id);
  // }
}
