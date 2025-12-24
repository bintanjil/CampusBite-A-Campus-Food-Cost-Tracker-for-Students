import { Expose } from "class-transformer";
export class UserResponseDto {

    @Expose()
    id: number;

    @Expose()
    name: string

    @Expose()
    email: string;

    @Expose()
    university: string;

    @Expose()
    isActive: boolean;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    role : string;
}



