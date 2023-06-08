import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { CurrentUser } from '../decoratos/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';
import { ListItem } from '../list-items/entities/list-item.entity';
import { ListItemsService } from '../list-items/list-items.service';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
    private readonly listItemService: ListItemsService,
  ) {}

  @Mutation(() => List, {name: 'CreateList'})
  createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser([ValidRoles.admin]) user: User
  ): Promise<List> {

    return this.listsService.create(createListInput, user)
  }

  @Query(() => [List], { name: 'findAllLists' })
  findAll(
    @CurrentUser([ValidRoles.admin]) user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ) {
    return this.listsService.findAll(user, paginationArgs ,searchArgs);
  }

  @Query(() => List, { name: 'findOneList' })
  findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([ValidRoles.admin]) user: User
  ) {
    return this.listsService.findOne(id, user);
  }

  @Mutation(() => List)
  updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser([ValidRoles.admin]) user: User
  ) {
    return this.listsService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List)
  removeList(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([ValidRoles.admin]) user: User
  ) {
    return this.listsService.remove(id, user);
  }

  @ResolveField(() => [ListItem], {name: "items"})
  async getListItems(
    @Parent() list: List,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<ListItem[]> {

    console.log({list});
    
    return this.listItemService.findAll(list, paginationArgs, searchArgs);
  }

  @ResolveField(() => Int, {name: 'totalItems'})
  async countListItemByList(
    @Parent() list: List
  ) {
    return this.listItemService.getItemlistcount(list);
  }
}
