import "reflect-metadata";
import {Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToMany, ManyToOne} from "typeorm";
import { UserProject } from "./UserProject";

@Entity()
export class Project {

    @PrimaryGeneratedColumn('uuid') //auto-increment 기능포함
    id!: string;

    @Column()
    title!: string;

    @Column()
    start_date!: string;

    @Column()
    end_date!: string;

    @OneToMany(() => UserProject, userProject => userProject.project)
    userProject!: UserProject[];
}
