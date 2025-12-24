import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";

@Controller('users')
export class UsersController {
    constructor (private readonly usersService: UsersService) {}
    @Get("all")
    async findAll() {
        return this.usersService.findAll();
    }

    @Get(":id")
    async getUserById(id: string) {
        return this.usersService.getUserById(id);
    }
    
    @Get("one/:id")
    async findOne(@Param("id") id: string) {
        return this.usersService.findOne(id);
    }

    @Post("create")
    async createUser(@Body() userData: Partial<User>) {
        return this.usersService.createUser(userData);
    }

    @Post("admin/create")
    async createAdminUser(@Body() userData: Partial<User>) {
        return this.usersService.createAdminUser(userData);
    }

    @Get("byEmail/:email")
    async getUserByEmail(email: string) {
        return this.usersService.getUserByEmail(email);
    }

    @Patch("update/:id")
    async updateUser(@Param("id") id: string, @Body() updateData: Partial<User>) {
        return this.usersService.updateUser(id, updateData);
    }

    @Patch("deactivate/:id")
    async deactivateUser(@Param("id") id: string) {
        return this.usersService.deactivateUser(id);
    }

    @Patch("activate/:id")
    async activateUser(@Param("id") id: string) {
        return this.usersService.activateUser(id);
    }

    @Patch("verify/:id")
    async verifyUser(@Param("id") id: string) {
        return this.usersService.varifyEmail(id);
    }

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
        @UploadedFile() file: Express.Multer.File
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }
        
        const profilePictureUrl = `/uploads/profile-pictures/${file.filename}`;
        return this.usersService.uploadProfilePicture(id, profilePictureUrl);
    }

    

}