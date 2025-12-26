import { Expose, Type } from "class-transformer";

class UserDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;
}

class RestaurantDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  type: string;
}

export class ReviewResponseDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => RestaurantDto)
  restaurant: RestaurantDto;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  rating: number;

  @Expose()
  comment: string;

  @Expose()
  foodQualityRating: number;

  @Expose()
  valueRating: number;

  @Expose()
  serviceRating: number;

  @Expose()
  priceRange: string;

  @Expose()
  isApproved: boolean;

  @Expose()
  helpfulCount: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}