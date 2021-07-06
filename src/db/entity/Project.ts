import "reflect-metadata";
import {Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToMany, ManyToOne, JoinTable} from "typeorm";
import { User } from "./User";
import { UserProject } from "./UserProject";

@Entity()
export class Project {

    @PrimaryGeneratedColumn('uuid') //auto-increment 기능포함
    id!: string;

    @Column()
    title!: string;

    @Column({ nullable: true})
    start_date!: string;

    @Column({ nullable: true})
    end_date!: string;

    @OneToMany(() => UserProject, user_project => user_project.project)
    user_project!: UserProject[];

}
