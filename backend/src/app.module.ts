import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule , TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '1111',
    database: 'camp_food_db',
    entities: [User],
    synchronize: true,
  }),],
  controllers: [],  
  providers: [],
})
export class AppModule {}
