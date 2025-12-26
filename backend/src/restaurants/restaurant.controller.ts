import { Controller, Get, UseGuards, Req, Query, Post, Body, Param, ParseUUIDPipe, Patch, Delete } from "@nestjs/common";
import { RestaurantService } from "./restaurant.service";
import { Filter } from "typeorm";
import { FilterRestaurantDto } from "./dtos/filter-restaurant.dto";
import { CreateRestaurantDto } from "./dtos/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dtos/update-restaurant.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { UserRole } from "src/users/entities/user.entity";

@Controller('restaurants')
export class RestaurantController {

    constructor(
        private readonly restaurantService: RestaurantService
    ) { }

    // Public GET endpoint
    @Get()
    async findAll(@Query() filters : FilterRestaurantDto) {
        return this.restaurantService.findAll(filters, false);
    }

    @Get('top-rated')
    async getTopRatedRestaurants(@Query('limit') limit : number) {
        return this.restaurantService.getTopRatedRestaurants(limit? limit : 10);
    }

    @Get('search')
    async search(@Query('query') query : string) {
        return this.restaurantService.search(query);
    }

    @Get('university/:university')
    async findByUniversity(@Param('university') university : string) {
        return this.restaurantService.findByUniversity(university);
    }

    // Dynamic :id route comes LAST
    @Get(':id')
    async findById(@Param('id' , ParseUUIDPipe) id : string) {
        return this.restaurantService.findById(id);
    }

    @Post('add')
    @UseGuards(JwtAuthGuard)
    async createRestaurant(@Req() req, @Body() createRestaurantDto : CreateRestaurantDto) {
        const userId = req.user.userId;
        return this.restaurantService.create(createRestaurantDto, userId);
    }

    @Patch(':id/approve')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    async approveRestaurant(@Param('id', ParseUUIDPipe) id : string) {
        return this.restaurantService.approveRestaurant(id);
    }

    @Patch(':id/unapprove')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    async unApproveRestaurant(@Param('id', ParseUUIDPipe) id : string) {
        return this.restaurantService.unApproveRestaurant(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async updateRestaurant(
        @Param('id', ParseUUIDPipe) id : string,
        @Body() updateRestaurantDto : UpdateRestaurantDto,
        @Req() req
    ) {
        const isAdmin = req.user?.role === UserRole.Admin;
        return this.restaurantService.update(
            id,
            updateRestaurantDto,
            req.user?.id,
            isAdmin
        );
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteRestaurant(
        @Param('id', ParseUUIDPipe) id : string,
        @Req() req
    ) {
        const isAdmin = req.user?.role === UserRole.Admin;
        return this.restaurantService.delete(
            id,
            req.user?.id,
            isAdmin
        );
    }

}
