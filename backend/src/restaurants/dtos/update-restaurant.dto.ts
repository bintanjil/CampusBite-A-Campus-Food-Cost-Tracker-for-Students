import { IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateRestaurantDto {

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(200)
     name?: string;
    @IsOptional()
    @IsString()
    @MinLength(10)
    @MaxLength(255)
    address?: string;
    @IsOptional()
    @IsString()
    @Matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/, {
    message: 'Invalid phone number format',})
    contactNumber?: string;

}