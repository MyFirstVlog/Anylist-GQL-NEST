import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class List {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  @IsString()
  @IsUUID()
  id: string;

  @Column('text')
  @Field(() => String)
  @IsString()
  name: string;

}
