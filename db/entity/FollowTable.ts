import "reflect-metadata";
import {Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToMany, ManyToOne} from "typeorm";
import { User } from "./User";

@Entity()
export class FollowTable {

    @PrimaryGeneratedColumn("uuid")
    userId!: string;

    @Column("uuid")
    followerId!: string; 

    @ManyToOne(() => User, user => user.id)
    user!: User;    
}
