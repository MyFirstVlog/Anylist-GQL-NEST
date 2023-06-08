import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { ItemsModule } from '../items/items.module';
import { ListsModule } from '../lists/lists.module';
import { ListItemsModule } from '../list-items/list-items.module';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [ConfigModule, UsersModule, ItemsModule, ListsModule, ListItemsModule]
})
export class SeedModule {}
