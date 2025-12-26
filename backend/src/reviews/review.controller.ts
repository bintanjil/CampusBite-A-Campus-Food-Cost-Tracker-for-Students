import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './review.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * Create a review for a restaurant (authenticated)
   * POST /reviews/restaurant/:restaurantId
   */
  @Post('restaurant/:restaurantId')
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Request() req,
  ) {
    return this.reviewsService.create(
      restaurantId,
      createReviewDto,
      req.user.userId,
    );
  }

  /**
   * Get all reviews for a restaurant (public)
   * GET /reviews/restaurant/:restaurantId
   */
  @Get('restaurant/:restaurantId')
  async findByRestaurant(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Request() req,
  ) {
    const isAdmin = req.user?.role === UserRole.Admin;
    return this.reviewsService.findByRestaurant(restaurantId, isAdmin);
  }

  /**
   * Get restaurant statistics
   * GET /reviews/restaurant/:restaurantId/stats
   */
  @Get('restaurant/:restaurantId/stats')
  async getRestaurantStats(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
  ) {
    return this.reviewsService.getRestaurantStats(restaurantId);
  }

  /**
   * Get user's review for a restaurant (authenticated)
   * GET /reviews/restaurant/:restaurantId/my-review
   */
  @Get('restaurant/:restaurantId/my-review')
  @UseGuards(JwtAuthGuard)
  async getMyReview(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Request() req,
  ) {
    return this.reviewsService.getUserReviewForRestaurant(
      restaurantId,
      req.user.userId,
    );
  }

  /**
   * Get all reviews by current user (authenticated)
   * GET /reviews/my-reviews
   */
  @Get('my-reviews')
  @UseGuards(JwtAuthGuard)
  async getMyReviews(@Request() req) {
    return this.reviewsService.findByUser(req.user.userId);
  }

  /**
   * Get top reviews (public)
   * GET /reviews/top?limit=10
   */
  @Get('top')
  async getTopReviews(@Query('limit') limit?: number) {
    return this.reviewsService.getTopReviews(limit ? +limit : 10);
  }

  /**
   * Get unapproved reviews (admin only)
   * GET /reviews/unapproved
   */
  @Get('unapproved')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async getUnapprovedReviews() {
    return this.reviewsService.getUnapprovedReviews();
  }

  /**
   * Get review by ID (public)
   * GET /reviews/:id
   */
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.findById(id);
  }

  /**
   * Update own review (authenticated)
   * PATCH /reviews/:id
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Request() req,
  ) {
    return this.reviewsService.update(id, updateReviewDto, req.user.userId);
  }

  /**
   * Delete review (owner or admin)
   * DELETE /reviews/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const isAdmin = req.user.role === UserRole.Admin;
    await this.reviewsService.remove(id, req.user.userId, isAdmin);
  }

  /**
   * Approve review (admin only)
   * PATCH /reviews/:id/approve
   */
  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async approve(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.approve(id);
  }

  /**
   * Unapprove review (admin only)
   * PATCH /reviews/:id/unapprove
   */
  @Patch(':id/unapprove')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async unapprove(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.unapprove(id);
  }

  /**
   * Mark review as helpful (authenticated)
   * PATCH /reviews/:id/helpful
   */
  @Patch(':id/helpful')
  @UseGuards(JwtAuthGuard)
  async markHelpful(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.reviewsService.markHelpful(id, req.user.userId);
  }
}
