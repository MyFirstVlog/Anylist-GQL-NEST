import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';
import { ConfigService } from '@nestjs/config';

@Resolver()
export class SeedResolver {
  
  constructor(
    private readonly seedService: SeedService
  ) {}ß

  @Mutation(() => Boolean)
  async executeSeed(): Promise<Boolean>{
    return this.seedService.executeSeed();
  }
}
