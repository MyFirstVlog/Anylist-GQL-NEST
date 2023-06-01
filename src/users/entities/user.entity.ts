import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from '../../items/entities/item.entity';

@Entity({name: 'users'})
@ObjectType()
export class User {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column('text')
  @Field(() => String)
  fullName: string;

  @Column('text', {unique: true})
  @Field(() => String)
  email: string;

  @Column('text')
  // @Field(() => String) //* If i DONT WANT TO EXPOSE IT IN GRAPHQL
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  @Field(() => [String])
  roles: string[];

  @Column({
    type: 'boolean',
    default: true
  })
  @Field(() => Boolean)
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.lastUpdatedBy, {nullable: true, lazy: true})
  @JoinColumn({name: 'lastUpdatedBy'})
  @Field(() => User, {nullable: true})
  lastUpdatedBy?: User

  @OneToMany(() => Item, (item) => item.user)
  @Field(() => [Item])
  items: Item[];


}
