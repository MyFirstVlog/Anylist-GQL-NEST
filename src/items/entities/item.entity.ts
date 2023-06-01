import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

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

  @ManyToOne(() => User, (user) => user.items, {nullable: false})
  @Index('userId-index')
  @Field(() => User)
  user: User;


}
