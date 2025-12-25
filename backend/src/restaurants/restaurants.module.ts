import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Restaurant } from "./entities/restaurant.entity";
import { UsersModule } from "src/users/users.module";
import { RestaurantController } from "./restaurant.controller";
import { RestaurantService } from "./restaurant.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Restaurant]),
        UsersModule,
    ],
    controllers: [RestaurantController],
    providers: [RestaurantService],
    exports: [RestaurantService],
})
export class RestaurantsModule {}