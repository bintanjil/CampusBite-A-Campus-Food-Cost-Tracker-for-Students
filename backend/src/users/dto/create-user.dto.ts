import { IsBoolean, IsEmail, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    @Matches(/^[a-zA-Z\s]+$/, { message: 'Name can only contain letters and spaces' })
    name : string;

    @IsEmail()
    email : string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',

    })
    password : string;

    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(100)
    university? : string;

    
}