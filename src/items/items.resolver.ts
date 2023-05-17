import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';

@Resolver(() => Item)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item, {name: 'createItem'})
  createItem(
    @Args('createItemInput') createItemInput: CreateItemInput
  ): Promise<Item> {
    return this.itemsService.create(createItemInput);
  }

  @Query(() => [Item], { name: 'findAll' })
  findAll() {
    return this.itemsService.findAll();
  }

  @Query(() => Item, { name: 'item' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.itemsService.findOne(id);
  }

  @Mutation(() => Item)
  updateItem(@Args('updateItemInput') updateItemInput: UpdateItemInput) {
    return this.itemsService.update(updateItemInput.id, updateItemInput);
  }

  @Mutation(() => Item)
  removeItem(@Args('id', { type: () => Int }) id: number) {
    return this.itemsService.remove(id);
  }
}