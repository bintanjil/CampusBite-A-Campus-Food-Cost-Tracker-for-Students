import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User, UserRole } from "./entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]> {
      return this.usersRepository.find({
        select: ['id', 'name', 'email', 'university', 'isActive', 'createdAt', 'updatedAt', 'isVerified', 'role', 'profilePicture'],
        order: { createdAt: 'DESC' },
      })
    }



    async getUserById(id: string): Promise<User> {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    }




    async getUserByEmail(email: string): Promise<User> {
      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    }

    async findByEmail(email: string): Promise<User | null> {
      return this.usersRepository.findOne({ where: { email } });
    }




    async createUser(userData: Partial<User>): Promise<User> {
      // Validate required fields
      if (!userData.email) {
        throw new ConflictException('Email is required');
      }
      if (!userData.password) {
        throw new ConflictException('Password is required');
      }
      
      // Check if user already exists
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
      
      // Hash password before saving
      const saltRounds = 10;
      userData.password = await bcrypt.hash(userData.password, saltRounds);
      
      // Create new user with normal user role
      const newUser = this.usersRepository.create({
        ...userData,
        role: UserRole.User,
      });
      
      return this.usersRepository.save(newUser);
    }



    async createAdminUser(userData: Partial<User>): Promise<User> {
      // Validate required fields
      if (!userData.email) {
        throw new ConflictException('Email is required');
      }
      if (!userData.password) {
        throw new ConflictException('Password is required');
      }
      
      // Check if user already exists
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
      
      // Hash password before saving
      const saltRounds = 10;
      userData.password = await bcrypt.hash(userData.password, saltRounds);
      
      // Create new user with admin role
      const newUser = this.usersRepository.create({
        ...userData,
        role: UserRole.Admin,
      });
      
      return this.usersRepository.save(newUser);
    }

    async findOne(id: string): Promise<User> {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    }

    async updateUser(id: string, updateData: Partial<User>): Promise<User> {
      const user = await this.getUserById(id);
      
      // Hash password if it's being updated
      if (updateData.password) {
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(updateData.password, saltRounds);
      }
      
      const updatedUser = Object.assign(user, updateData);
      return this.usersRepository.save(updatedUser);
    }
    
    async changeRole(id: string, newRole: UserRole): Promise<User> {
      const user = await this.getUserById(id);
      user.role = newRole;
      return this.usersRepository.save(user);
    }

    async deactivateUser(id: string): Promise<User> {
      const user = await this.getUserById(id);
      user.isActive = false;
      return this.usersRepository.save(user);
    }

    async activateUser(id: string): Promise<User> {
      const user = await this.getUserById(id);
      user.isActive = true;
      return this.usersRepository.save(user);
    }

    async deleteUser(id: string): Promise<void> {
      const user = await this.getUserById(id);
      await this.usersRepository.remove(user);
    }

    async varifyEmail(id: string): Promise<User> {
      const user = await this.getUserById(id);
      user.isVerified = true;
      return this.usersRepository.save(user);
    }

    async uploadProfilePicture(id: string, profilePictureUrl: string): Promise<User> {
      const user = await this.getUserById(id);
      user.profilePicture = profilePictureUrl;
      return this.usersRepository.save(user);
    }
}