import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum RestaurantType {
    CampusCanteen = "campus_canteen",
    Cafe = "cafe",
    Restaurant = "restaurant",
}
@Entity("restaurants")
export class Restaurant {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "varchar", length: 100})
    name: string;

    @Column({type: "varchar", length: 255, nullable: true})
    address: string;

    @Column({type: "varchar", length: 100})
    university: string;

    @Column({
        type: "enum",
        enum: RestaurantType,
    })
    type: RestaurantType;

    @Column({type: "varchar", length: 255, nullable: true})
    googleMapLink: string;

    @Column({type: "decimal", precision: 10, scale: 8, nullable: true})
    latitude: number;

    @Column({type: "decimal", precision: 11, scale: 8, nullable: true})
    longitude: number;

    @Column({type: "varchar", length: 20, nullable: true})
    contactNumber: string;

    @Column({type: "boolean", default: false})
    approved: boolean;

    @Column({type: "decimal", precision: 3, scale: 2, default: 0})
    averageRating: number;

    @Column({type: "int", default: 0})
    totalReviews: number;

    @ManyToOne(() => User , { nullable: false })
    @JoinColumn({ name: "createdBy" })
    createdBy: User;

    @Column({name: "createdBy"})
    createdById: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;




}