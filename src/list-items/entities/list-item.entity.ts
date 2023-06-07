import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { List } from '../../lists/entities/list.entity';
import { Item } from '../../items/entities/item.entity';

@Entity({name: 'listItems'})
@ObjectType()
export class ListItem {
 
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Number)
  @Column({type: 'numeric'})
  quantity: number;

  @Field(() => Boolean)
  @Column({type: 'boolean'})
  completed: boolean;

  @ManyToOne(() => List, (list) => list.listItems, {lazy: true})
  // @Field(() => List)
  list: List;

  @ManyToOne(() => Item, (item) => item.listItems, {lazy: true})
  @Field(() => Item)
  item: Item;

}
