import { IsString } from 'class-validator';
import { CreateListInput } from './create-list.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateListInput extends PartialType(CreateListInput) {
  @IsString()
  @Field(() => ID)
  id: string;

  @IsString()
  @Field(() => String)
  name: string;
}
