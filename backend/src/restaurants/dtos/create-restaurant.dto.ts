import { IsEnum, IsNumberString, IsOptional, IsString, IsUrl, Matches, Max, MaxLength, Min, MinLength } from "class-validator";
import { Restaurant, RestaurantType } from "../entities/restaurant.entity";

export class CreateRestaurantDto {

    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name: string;

    @IsEnum(RestaurantType, { message: 'Type must be from cafe , campus_canteen and restaurant' })
    type : RestaurantType;

    @IsString()
    @MinLength(3)
    @IsOptional()
    @MaxLength(255)
    address?: string;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    university : string;

    @IsString()
    @MinLength(10)
    @MaxLength(255)
    @IsOptional()
    @IsUrl({}, { message: 'Invalid Google Maps URL' })
    googleMapLink?: string;

    @IsOptional()
    @IsNumberString()
    latitude?: number;

    @IsOptional()
    @IsNumberString()
    longitude?: number;

    @IsOptional()
    @IsString()
    @Matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/, {
    message: 'Invalid phone number format',})
    contactNumber?: string;
    

}