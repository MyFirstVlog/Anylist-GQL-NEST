import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString, Min } from 'class-validator';

@InputType()
export class CreateListInput {
  
  @IsString()
  @Field(() => String)
  name: string;

}
