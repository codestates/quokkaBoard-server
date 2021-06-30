import "reflect-metadata";
import {Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToMany, ManyToOne} from "typeorm";
import { UserProject } from "./UserProject";

@Entity()
export class Project {

    @PrimaryGeneratedColumn() //auto-increment 기능포함
    id!: number;

    @Column()
    title!: string;

    @Column()
    created_at!: Date;

    @Column()
    updated_at!: Date;

    @Column()
    end_date!: Date;

    @OneToMany(() => UserProject, userProject => userProject.project)
    userProject!: UserProject[];
}
