import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User, UserRole } from "./entities/user.entity";
import { Repository } from "typeorm";
import { error } from "console";

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
        throw error;
      }
      return user;
    }




    async getUserByEmail(email: string): Promise<User> {
      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) {
        throw error;
      }
      return user;
    }




    async createUser(userData: Partial<User>): Promise<User> {
      const existingUser = await this.usersRepository.findOne({ where: { email: userData.email } });
      try{
        if (existingUser) {
          throw new Error('User with this email already exists');
        }
      }
      catch(error){
        throw  error;
      }
      const newUser = this.usersRepository.create(userData);
      newUser.role = UserRole.User;
      return this.usersRepository.save(newUser);
    }



    async createAdminUser(userData: Partial<User>): Promise<User> {
      const existingUser = await this.usersRepository.findOne({ where: { email: userData.email } });
      try{
        if (existingUser) {
          throw new Error('User with this email already exists');
        } 
      }
      catch(error){
        throw  error;
      }
      const newUser = this.usersRepository.create(userData);
      newUser.role = UserRole.Admin;
      return this.usersRepository.save(newUser);
    }

    async findOne(id: string): Promise<User> {
      const user = await this.usersRepository.findOne({ where: { id } });
      try{
        if (!user) {
          throw new Error('User not found');
        }
      }
      catch(error){
        throw  error;
      }
      return user;
    }




    async updateUser(id: string, updateData: Partial<User>): Promise<User> {
      const existUser = await this.getUserById(id);
      try{
        if (!existUser) {
          throw new Error('User not found');
        }

      }
      catch(error){
        throw  error;
      }
      const updatedUser = Object.assign(existUser, updateData);
      return this.usersRepository.save(updatedUser);
    }
    

    async changeRole(id: string, newRole: UserRole): Promise<User> {
      const user = await this.getUserById(id);
      try{
        if (!user) {
          throw new Error('User not found');
        }
      }
      catch(error){
        throw  error;
      }
      user.role = newRole;
      return this.usersRepository.save(user);
    }

    async deactivateUser(id: string): Promise<User> {
      const user = await this.getUserById(id);
      try{
        if( !user) {
          throw new Error('User not found');
        }

      }
      catch(error){
        throw  error;
      }
      user.isActive = false;
      return this.usersRepository.save(user);
    }


    async activateUser(id: string): Promise<User> {
      const user = await this.getUserById(id);
      try{
        if (!user) {
          throw new Error('User not found');
        }
      }
      catch(error){
        throw  error;
      }
      user.isActive = true;
      return this.usersRepository.save(user);
    }

    async deleteUser(id: string): Promise<void> {
      const user = await this.getUserById(id);
      try{
        if (!user) {
          throw new Error('User not found');
        }
      }
      catch(error){
        throw  error;
      }
      await this.usersRepository.remove(user);
    }


    async varifyEmail(id: string): Promise<User> {
      const user = await this.getUserById(id);
      try{
        if (!user) {
          throw error;
        }
      }
      catch(error){
        throw  error;
      }
      user.isVerified = true;
      return this.usersRepository.save(user);
    }

    async uploadProfilePicture(id: string, profilePictureUrl: string): Promise<User> {
      const user = await this.getUserById(id);
      try {
        if (!user) {
          throw new Error('User not found');
        }
      } catch (error) {
        throw error;
      }
      user.profilePicture = profilePictureUrl;
      return this.usersRepository.save(user);
    }

    




    
}