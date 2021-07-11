import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Board } from "./Board";
import { UserProject } from "./UserProject";

@Entity()
export class Project {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column({ nullable: true})
    description!: string;

    @Column({ nullable: true})
    start_date!: string;

    @Column({ nullable: true})
    end_date!: string;

    @OneToMany(() => UserProject, user_project => user_project.project)
    user_project!: UserProject[];

    @OneToMany(() => Board, board => board.project)
    board!: Board[];

}
