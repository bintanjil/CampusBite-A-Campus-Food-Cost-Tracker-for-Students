import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
    Admin = "admin",
    User = "user",
}

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "varchar", length: 100})
    name: string;

    @Column({type: "varchar", length: 100, unique: true})
    email: string;

    @Column({type: "varchar", length: 100})
    password: string;

    @Column({type: "varchar", length: 100 , nullable: true})
    university: string;

    @Column({type: "boolean", default: true})
    isActive: boolean;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({type: "boolean", default: false})
    isVerified: boolean;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.User,

    })
    role : UserRole;

    @Column({ type: "varchar", length: 255, nullable: true })
    profilePicture: string;
    
}