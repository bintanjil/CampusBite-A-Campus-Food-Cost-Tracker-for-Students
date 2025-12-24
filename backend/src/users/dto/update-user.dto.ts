import { IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class UpdateUserDto {
    
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(100)
    university?: string;

}