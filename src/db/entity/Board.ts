import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToMany, ManyToOne } from "typeorm";
import { Project } from "./Project";
// import { Task } from "./Task.txt"
import bcrypt from "bcrypt";

@Entity()
export class Board {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    projectId!: number;

    @Column()
    colomn_index!: number;

    @Column()
    created_at!: Date;

    @Column()
    updated_at!: Date;

    @ManyToOne(() => Project, project => project.id)
    project!: Project; // project -> board

    // @OneToMany(() => Task, task => task.boardId)
    // task!: Task[]; // board -> task 

}
