import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {
  
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @IsPositive()
  @Field(() => Float)
  quantity: number;

  @IsString()
  @IsOptional()
  @Field(() => String, {nullable: true})
  quantityUnits?: string;

}
