import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors, BadRequestException, ParseUUIDPipe } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from "./users.service";
import { User, UserRole } from "./entities/user.entity";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller('users')
export class UsersController {
    constructor (private readonly usersService: UsersService) {}
    
    @Roles(UserRole.Admin)
    @Get("all")
    async findAll() {
        return this.usersService.findAll();
    }

    @Get(":id")
    async getUserById(@Param('id' , new ParseUUIDPipe()) id: string, @CurrentUser() user: any) {
        // Users can only view their own profile, admins can view anyone
        if (user.role !== UserRole.Admin && user.userId !== id) {
            throw new BadRequestException('You can only view your own profile');
        }
        return this.usersService.getUserById(id);
    }
    
    @Get("one/:id")
    async findOne(@Param("id") id: string, @CurrentUser() user: any) {
        // Users can only view their own profile, admins can view anyone
        if (user.role !== UserRole.Admin && user.userId !== id) {
            throw new BadRequestException('You can only view your own profile');
        }
        return this.usersService.findOne(id);
    }

    @Roles(UserRole.Admin)
    @Post("admin/create")
    async createAdminUser(@Body() userData: Partial<User>) {
        return this.usersService.createAdminUser(userData);
    }

    @Get("byEmail/:email")
    async getUserByEmail(@Param("email") email: string, @CurrentUser() user: any) {
        // Users can only search their own email, admins can search anyone
        if (user.role !== UserRole.Admin && user.email !== email) {
            throw new BadRequestException('You can only search your own email');
        }
        return this.usersService.getUserByEmail(email);
    }

    @Patch("update/:id")
    async updateUser(@Param("id") id: string, @Body() updateData: Partial<User>, @CurrentUser() user: any) {
        // Users can only update their own profile, admins can update anyone
        if (user.role !== UserRole.Admin && user.userId !== id) {
            throw new BadRequestException('You can only update your own profile');
        }
        // Prevent non-admins from changing their role
        if (user.role !== UserRole.Admin && updateData.role) {
            throw new BadRequestException('You cannot change your role');
        }
        return this.usersService.updateUser(id, updateData);
    }

    @Roles(UserRole.Admin)
    @Patch("deactivate/:id")
    async deactivateUser(@Param("id") id: string) {
        return this.usersService.deactivateUser(id);
    }

    @Roles(UserRole.Admin)
    @Patch("activate/:id")
    async activateUser(@Param("id") id: string) {
        return this.usersService.activateUser(id);
    }

    @Roles(UserRole.Admin)
    @Patch("verify/:id")
    async verifyUser(@Param("id") id: string) {
        return this.usersService.varifyEmail(id);
    }

    @Roles(UserRole.Admin)
    @Delete("delete/:id")
    async deleteUser(@Param("id") id: string) {
        return this.usersService.deleteUser(id);
    }
    
    @Post("uploadProfilePicture/:id")
    @UseInterceptors(FileInterceptor('profilePicture', {
        storage: diskStorage({
            destination: './uploads/profile-pictures',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                cb(null, `profile-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            
            if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                return cb(new BadRequestException('Only image files are allowed (jpg, jpeg, png)'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB max file size
        },
    }))
    async uploadProfilePicture(
        @Param("id") id: string, 
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() user: any
    ) {
        // Users can only upload their own profile picture, admins can upload for anyone
        if (user.role !== UserRole.Admin && user.userId !== id) {
            throw new BadRequestException('You can only upload your own profile picture');
        }
        
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }
        
        const profilePictureUrl = `/uploads/profile-pictures/${file.filename}`;
        return this.usersService.uploadProfilePicture(id, profilePictureUrl);
    }

    

}