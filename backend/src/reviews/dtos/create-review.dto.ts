import { IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateReviewDto {

    @IsInt()
    @Min(1 , { message: 'Rating must be at least 1' })
    @Max(5 , { message: 'Rating can not be more than 5' })
    rating: number;

    @IsOptional()
    @IsString()
    @MinLength(10 , { message: 'Comment must be at least 10 characters long' })
    @MaxLength(500 , { message: 'Comment can not be more than 500 characters long' })
    comment?: string

    @IsOptional()
    @IsInt()
    @Min(1 , { message: 'Food Quality Rating must be at least 1' })
    @Max(5 , { message: 'Food Quality Rating can not be more than 5' })
    foodQualityRating?: number;

    @IsOptional()
    @IsInt()
    @Min(1 , { message: 'Service Rating must be at least 1' })
    @Max(5 , { message: 'Service Rating can not be more than 5' })
    serviceRating?: number;

    @IsOptional()
    @IsInt()
    @Min(1 , { message: 'Value Rating must be at least 1' })
    @Max(5 , { message: 'Value Rating can not be more than 5' })
    valueRating?: number

    @IsOptional()
    @IsString()
    @MaxLength(50 , { message: 'Price Range can not be more than 50 characters long' }) 
    priceRange?: string;

}