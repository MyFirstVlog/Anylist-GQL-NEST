import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { CurrentUser } from '../decoratos/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListsResolver {
  constructor(private readonly listsService: ListsService) {}

  @Mutation(() => List, {name: 'CreateList'})
  createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser([ValidRoles.admin]) user: User
  ): Promise<List> {

    return this.listsService.create(createListInput, user)
  }

  @Query(() => [List], { name: 'findAllLists' })
  findAll(
    @CurrentUser([ValidRoles.admin]) user: User
  ) {
    return this.listsService.findAll(user);
  }

  @Query(() => List, { name: 'findOneList' })
  findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([ValidRoles.admin]) user: User
  ) {
    return this.listsService.findOne(id, user);
  }

  @Mutation(() => List)
  updateList(@Args('updateListInput') updateListInput: UpdateListInput) {
    return this.listsService.update(updateListInput.id, updateListInput);
  }

  @Mutation(() => List)
  removeList(@Args('id', { type: () => Int }) id: number) {
    return this.listsService.remove(id);
  }
}
