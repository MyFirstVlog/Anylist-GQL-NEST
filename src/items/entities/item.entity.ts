import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({name: 'items'})
export class Item {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column('text')
  @Field(() => String)
  name: string;

  @Column('int')
  @Field(() => Float)
  quantity: number;

  @Column('text', {nullable: true})
  @Field(() => String, {nullable: true})
  quantityUnits?: string;


}
