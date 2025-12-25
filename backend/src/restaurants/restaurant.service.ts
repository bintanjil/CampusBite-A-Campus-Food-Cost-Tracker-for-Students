import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "./entities/restaurant.entity";
import { Filter, Repository } from "typeorm";
import { FilterRestaurantDto } from "./dtos/filter-restaurant.dto";
import { filter } from "rxjs";
import { UpdateRestaurantDto } from "./dtos/update-restaurant.dto";

@Injectable()
export class RestaurantService {
   constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
   ) {}

   async findAll(
    filters : FilterRestaurantDto,
    isAdmin : boolean = false
): Promise<Restaurant[]> {
     const query = this.restaurantRepository.createQueryBuilder('restaurant').leftJoinAndSelect('restaurant.createdBy', 'createdBy');
     if(!isAdmin) {
      query.andWhere('restaurant.approved = :approved', { approved: true });
     }
     if(filters.university){
        query.andWhere('restaurant.university = :university', { university: filters.university });
     }

     if(filters.type){
        query.andWhere('restaurant.type = :type', { type: filters.type });
     }
     if(filters.name){
        query.andWhere('restaurant.name = :name', { name: filters.name });
     }
     if(filters.approved !== undefined){
        query.andWhere('restaurant.approved = :approved', { approved: filters.approved });
     }
        if(filters.search){
        query.andWhere('(restaurant.name ILIKE :search OR restaurant.university ILIKE :search OR restaurant.address ILIKE :search)', { search: `%${filters.search}%` });
     }
        return query.orderBy('restaurant.createdAt', 'DESC').
        addOrderBy('restaurant.name', 'ASC').getMany();
   }

  async findById(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    
    return restaurant;
  }

  async update(id : string 
    ,updateRestaurantDto : UpdateRestaurantDto,
    userId : string,
    isAdmin : boolean = false
    ) : Promise<Restaurant> {
    const restaurant = await this.findById(id);
    if(!isAdmin && restaurant.createdBy.id !== userId){
        throw new ForbiddenException('You do not have permission to update this restaurant');
    }
    Object.assign(restaurant, updateRestaurantDto);
    return this.restaurantRepository.save(restaurant);
  }

  async delete(
    id : string,
    userId : string,
    isAdmin : boolean = false
  ) : Promise<void> {
    const restaurant = await this.findById(id);
    if(!isAdmin && restaurant.createdBy.id !== userId){
        throw new ForbiddenException('You do not have permission to delete this restaurant');
    }
    await this.restaurantRepository.remove(restaurant);
  }

  async approveRestaurant(id: string): Promise<Restaurant> {
    const restaurant = await this.findById(id);
    restaurant.approved = true;
    return this.restaurantRepository.save(restaurant);
  }

  async unApproveRestaurant(id: string): Promise<void> {
    const restaurant = await this.findById(id);
    restaurant.approved = false;
    await this.restaurantRepository.save(restaurant);
  }

  async findByUniversity(university: string): Promise<Restaurant[]> {
    return this.restaurantRepository.find({
      where: { university, approved: true },
      relations: ['createdBy'],
      order: { createdAt: 'DESC', name: 'ASC' },
    });
  }
  async getTotalRestaurantsCount(): Promise<number> {
    return this.restaurantRepository.count();
  }
  async getTopRatedRestaurants(limit: number = 10): Promise<Restaurant[]> {
    return this.restaurantRepository.createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.createdBy', 'createdBy')
      .where('restaurant.approved = :approved', { approved: true })
      .orderBy('restaurant.averageRating', 'DESC')
      .addOrderBy('restaurant.totalReviews', 'DESC')
      .limit(limit)
      .getMany();
  }

  async search(query: string): Promise<Restaurant[]> {
    return this.restaurantRepository.createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.createdBy', 'createdBy')
      .where('restaurant.approved = :approved', { approved: true })
      .andWhere('(restaurant.name ILIKE :query OR restaurant.university ILIKE :query OR restaurant.address ILIKE :query)', { query: `%${query}%` })
      .orderBy('restaurant.createdAt', 'DESC')
      .addOrderBy('restaurant.name', 'ASC')
      .getMany();
  }

  async create(
    restaurantData: Partial<Restaurant>,
    userId: string
    ): Promise<Restaurant> {
        const restaurant = this.restaurantRepository.create({
            ...restaurantData,
            createdBy: { id: userId },
            approved: false,
        });
        return this.restaurantRepository.save(restaurant);
    }

    async updateRating(
      id: string,
      newAverageRating: number,
      newTotalReviews: number
    ): Promise<Restaurant> {
      const restaurant = await this.findById(id);
      restaurant.averageRating = newAverageRating;
      restaurant.totalReviews = newTotalReviews;
      return this.restaurantRepository.save(restaurant);
    }

}