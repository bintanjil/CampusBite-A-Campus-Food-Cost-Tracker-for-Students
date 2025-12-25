import { Expose, Type } from "class-transformer";

class CreatedByDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;
}

export class RestaurantResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  type: string;

  @Expose()
  university: string;

  @Expose()
  address: string;

  @Expose()
  googleMapLink: string;

  @Expose()
  latitude: number;

  @Expose()
  longitude: number;

  @Expose()
  phone: string;

  @Expose()
  approved: boolean;

  @Expose()
  averageRating: number;

  @Expose()
  totalReviews: number;

  @Expose()
  @Type(() => CreatedByDto)
  createdBy: CreatedByDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}