import "reflect-metadata";
import {Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToMany, ManyToOne, JoinTable} from "typeorm";
import { User } from "./User";
import { UserProject } from "./UserProject";
import { Board } from "./Board";

@Entity()
export class Project {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column()
    start_date!: Date;

    @Column()
    end_date!: Date;

    @OneToMany(() => UserProject, userProject => userProject.project)
    userProject!: UserProject[];
    
    @OneToMany(() => Board, board => board.project)
    board!: Board[];
}
