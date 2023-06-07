import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {
  
  @Field(() => Number, {nullable: true})
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity: number = 0;

  @Field(() => Boolean)
  @IsOptional()
  @IsBoolean()
  completed: boolean = false;

  @Field(() => String)
  @IsUUID()
  listId: string;

  @Field(() => String)
  @IsUUID()
  itemId: string;

}
