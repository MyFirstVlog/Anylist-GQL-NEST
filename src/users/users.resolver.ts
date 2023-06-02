import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRolesArgs } from './dto/args/role.arg';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { CurrentUser } from 'src/decoratos/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { ItemsService } from 'src/items/items.service';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService
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
}
