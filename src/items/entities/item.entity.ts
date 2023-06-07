import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ListItem } from '../../list-items/entities/list-item.entity';

@ObjectType()
@Entity({name: 'items'})
export class Item {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string; 

  @Column('text')
  @Field(() => String)
  name: string;

  // @Column('int')
  // @Field(() => Float)
  // quantity: number;

  @Column('text', {nullable: true})
  @Field(() => String, {nullable: true})
  quantityUnits?: string;

  @ManyToOne(() => User, (user) => user.items, {nullable: false, lazy: true})
  @Index('userId-index')
  // @Field(() => User)
  user: User;


  @OneToMany(() => ListItem, (listItem) => listItem.item, {lazy: true})
  @Field(() => [ListItem])
  listItems: ListItem[];
}
