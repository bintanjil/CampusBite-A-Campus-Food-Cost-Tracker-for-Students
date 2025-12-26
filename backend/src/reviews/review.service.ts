import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { RestaurantService } from '../restaurants/restaurant.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly restaurantService: RestaurantService,
  ) {}

  /**
   * Create a new review
   * - One review per user per restaurant
   * - Updates restaurant's average rating
   */
  async create(
    restaurantId: string,
    createReviewDto: CreateReviewDto,
    userId: string,
  ): Promise<Review> {
    // Check if restaurant exists
    const restaurant = await this.restaurantService.findById(restaurantId);

    // Check if user already reviewed this restaurant
    const existingReview = await this.reviewsRepository.findOne({
      where: {
        restaurantId,
        userId,
      },
    });

    if (existingReview) {
      throw new ConflictException(
        'You have already reviewed this restaurant. Use update instead.',
      );
    }

    // Create review
    const review = this.reviewsRepository.create({
      ...createReviewDto,
      restaurantId,
      userId,
      isApproved: true, // Auto-approve for now
    });

    const savedReview = await this.reviewsRepository.save(review);

    // Update restaurant rating
    await this.updateRestaurantRating(restaurantId);

    return savedReview;
  }

  /**
   * Get all reviews for a restaurant
   */
  async findByRestaurant(
    restaurantId: string,
    isAdmin: boolean = false,
  ): Promise<Review[]> {
    const query = this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.restaurant', 'restaurant')
      .where('review.restaurantId = :restaurantId', { restaurantId });

    // Non-admins only see approved reviews
    if (!isAdmin) {
      query.andWhere('review.isApproved = :isApproved', { isApproved: true });
    }

    return query.orderBy('review.createdAt', 'DESC').getMany();
  }

  /**
   * Get all reviews by a user
   */
  async findByUser(userId: string): Promise<Review[]> {
    return this.reviewsRepository.find({
      where: { userId },
      relations: ['restaurant', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get review by ID
   */
  async findById(id: string): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['restaurant', 'user'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  /**
   * Update review
   * - Only the author can update
   */
  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
    userId: string,
  ): Promise<Review> {
    const review = await this.findById(id);

    // Check ownership
    if (review.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this review',
      );
    }

    Object.assign(review, updateReviewDto);
    const updatedReview = await this.reviewsRepository.save(review);

    // Recalculate restaurant rating
    await this.updateRestaurantRating(review.restaurantId);

    return updatedReview;
  }

  /**
   * Delete review
   * - Author or admin can delete
   */
  async remove(
    id: string,
    userId: string,
    isAdmin: boolean = false,
  ): Promise<void> {
    const review = await this.findById(id);

    // Check permissions
    if (!isAdmin && review.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this review',
      );
    }

    const restaurantId = review.restaurantId;
    await this.reviewsRepository.remove(review);

    // Recalculate restaurant rating
    await this.updateRestaurantRating(restaurantId);
  }

  /**
   * Approve review (Admin only)
   */
  async approve(id: string): Promise<Review> {
    const review = await this.findById(id);
    review.isApproved = true;
    return this.reviewsRepository.save(review);
  }

  /**
   * Unapprove review (Admin only)
   */
  async unapprove(id: string): Promise<Review> {
    const review = await this.findById(id);
    review.isApproved = false;
    return this.reviewsRepository.save(review);
  }

  /**
   * Mark review as helpful
   */
  async markHelpful(id: string, userId: string): Promise<Review> {
    const review = await this.findById(id);
    review.helpfulCount += 1;
    return this.reviewsRepository.save(review);
  }

  /**
   * Get user's review for a specific restaurant
   */
  async getUserReviewForRestaurant(
    restaurantId: string,
    userId: string,
  ): Promise<Review | null> {
    return this.reviewsRepository.findOne({
      where: {
        restaurantId,
        userId,
      },
      relations: ['restaurant', 'user'],
    });
  }

  /**
   * Update restaurant's average rating and total reviews
   * Called after create/update/delete review
   */
  private async updateRestaurantRating(restaurantId: string): Promise<void> {
    const result = await this.reviewsRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avgRating')
      .addSelect('COUNT(review.id)', 'totalReviews')
      .where('review.restaurantId = :restaurantId', { restaurantId })
      .andWhere('review.isApproved = :isApproved', { isApproved: true })
      .getRawOne();

    const avgRating = parseFloat(result.avgRating) || 0;
    const totalReviews = parseInt(result.totalReviews) || 0;

    await this.restaurantService.updateRating(
      restaurantId,
      Number(avgRating.toFixed(2)),
      totalReviews,
    );
  }

  /**
   * Get all unapproved reviews (Admin only)
   */
  async getUnapprovedReviews(): Promise<Review[]> {
    return this.reviewsRepository.find({
      where: { isApproved: false },
      relations: ['restaurant', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Top reviews (highest rated with most helpful)
   */
  async getTopReviews(limit: number = 10): Promise<Review[]> {
    return this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.restaurant', 'restaurant')
      .where('review.isApproved = :isApproved', { isApproved: true })
      .orderBy('review.rating', 'DESC')
      .addOrderBy('review.helpfulCount', 'DESC')
      .limit(limit)
      .getMany();
  }

  /**
   * Get statistics for a restaurant
   */
  async getRestaurantStats(restaurantId: string) {
    const reviews = await this.reviewsRepository.find({
      where: { restaurantId, isApproved: true },
    });

    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        averageFoodQuality: 0,
        averageValue: 0,
        averageService: 0,
      };
    }

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalFoodQuality = 0;
    let totalValue = 0;
    let totalService = 0;
    let foodQualityCount = 0;
    let valueCount = 0;
    let serviceCount = 0;

    reviews.forEach((review) => {
      ratingDistribution[review.rating]++;
      
      if (review.foodQualityRating) {
        totalFoodQuality += review.foodQualityRating;
        foodQualityCount++;
      }
      if (review.valueRating) {
        totalValue += review.valueRating;
        valueCount++;
      }
      if (review.serviceRating) {
        totalService += review.serviceRating;
        serviceCount++;
      }
    });

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);

    return {
      totalReviews: reviews.length,
      averageRating: (totalRating / reviews.length).toFixed(2),
      ratingDistribution,
      averageFoodQuality: foodQualityCount
        ? (totalFoodQuality / foodQualityCount).toFixed(2)
        : 0,
      averageValue: valueCount ? (totalValue / valueCount).toFixed(2) : 0,
      averageService: serviceCount
        ? (totalService / serviceCount).toFixed(2)
        : 0,
    };
  }
}
