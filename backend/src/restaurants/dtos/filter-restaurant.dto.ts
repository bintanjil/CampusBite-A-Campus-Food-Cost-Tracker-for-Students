import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { Restaurant, RestaurantType } from "../entities/restaurant.entity";
import { Res } from "@nestjs/common";
import { Transform } from "class-transformer";

export class FilterRestaurantDto {

    @IsOptional()
    @IsString()
    name ?: string;


    @IsOptional()
    @IsString()
    university?: string;

    @IsOptional()
    @IsEnum(RestaurantType, { message: 'Type must be from cafe , campus_canteen and restaurant' })
    type?: RestaurantType;

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    approved?: boolean;

    @IsOptional()
    @IsString()
    search?: string;
}