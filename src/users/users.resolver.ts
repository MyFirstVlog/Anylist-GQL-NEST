import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRolesArgs } from './dto/args/role.arg';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { CurrentUser } from '../decoratos/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { ItemsService } from '../items/items.service';
import { Item } from '../items/entities/item.entity';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';
import { List } from '../lists/entities/list.entity';
import { ListsService } from '../lists/lists.service';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
  ) {}

  @Query(() => [User], { name: 'findAllUsers' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.admin]) user: User
  ) : Promise<User[]>{
    console.log({validRoles, user})
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID },ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User)
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @Mutation(() => User, {name: 'updateUser'})
  updateUser(
    @Args('updateUserInput')updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin]) user: User
  ){
    return this.usersService.update(updateUserInput.id, updateUserInput, user)
  }

  @ResolveField(() => Int )
  async getItemsCount(
    @Parent() user: User
  ){
    return await this.itemsService.itemsFromUser(user);
  }

  @ResolveField(() => [Item], {name: 'items'} )
  async getItemsByUser(
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ){
    return await this.itemsService.findAll(user, paginationArgs, searchArgs);
  }

  @ResolveField(() => [List], {name: 'getListByUser'})
  async getListsByUser(
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ){
    return await this.listsService.findAll(user, paginationArgs, searchArgs);
  }
}
