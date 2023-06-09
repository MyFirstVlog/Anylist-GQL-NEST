import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ItemsModule } from './items/items.module';
import { ApolloServerPluginLandingPageLocalDefault } from  '@apollo/server/plugin/landingPage/default';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListsModule } from './lists/lists.module';
import { ListItemsModule } from './list-items/list-items.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [JwtService],
      useFactory: async (jwtService: JwtService) => ({
        playground: false,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        plugins: [
          ApolloServerPluginLandingPageLocalDefault()
        ],
        context({req}){
          // const token = req.headers.authorization?.replace("Bearer ", "");
          // if (!token) throw new Error('token not valid'); 

          // const payload = jwtService.decode(token);
          // if(!Object.keys(payload).includes('id')) throw new Error('body not valid'); 
        }
      }),
    }),

    //* Configuracion basica
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   playground: false,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //   plugins: [
    //     ApolloServerPluginLandingPageLocalDefault()
    //   ]
    // }),

    TypeOrmModule.forRoot({
      ssl: (process.env.STATE === 'prod')
        ? {
          rejectUnauthorized: false,
          sslmode: 'require',
        } : false as any,
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ItemsModule,
    UsersModule,
    AuthModule,
    SeedModule,
    CommonModule,
    ListsModule,
    ListItemsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

  constructor(){
    console.log("state", process.env.STATE)
    console.log("host", process.env.DB_HOST)
    console.log("port", +process.env.DB_PORT)
    console.log("username", process.env.DB_USERNAME)
    console.log("password", process.env.DB_PASSWORD)
    console.log("database", process.env.DB_NAME)
  }

}
