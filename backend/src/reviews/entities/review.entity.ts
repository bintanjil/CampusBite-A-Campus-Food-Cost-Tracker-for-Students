import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity('reviews')
@Unique(['userId', 'restaurantId'])
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Restaurant, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'restaurant_id' })
    restaurant: Restaurant;

    @Column({ name: 'restaurant_id' })
    restaurantId: string;

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ type: 'int' })
    rating: number;

    @Column({ type: 'text', nullable: true })
    comment: string;

    @Column({ type: 'int', nullable: true })
    foodQualityRating: number;

    @Column({ type: 'int', nullable: true })
    serviceRating: number;

    @Column({ type: 'int', nullable: true })
    valueRating: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    priceRange: string;

    @Column({ type: 'boolean', default: true })
    isApproved: boolean;

    @Column({ type: 'int', default: 0 })
    helpfulCount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
     updatedAt: Date;


}