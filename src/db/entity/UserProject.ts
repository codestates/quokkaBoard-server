import "reflect-metadata";
import {
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    ManyToMany
} from "typeorm";
import { User } from "./User";
import { Project } from "./Project";
import { Comment } from "./Comment";
import { Task} from "./Task"

@Entity()
export class UserProject {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({nullable: true})
    authority!: string;

    @Column("uuid")
    userId!: string;

    @Column("uuid")
    projectId!: string;
   
    @ManyToOne(() => User, user => user.user_project, {
        primary: true, onDelete:'CASCADE'
    })
    user!: User;
    
    @ManyToOne(() => Project, project => project.user_project, {
        primary: true, onDelete:'CASCADE'
    })
    project!: Project;

    @ManyToMany(() => Comment, comment => comment.user_projects, {
        onDelete: "CASCADE"
    })
    comments!: Comment[];

    @ManyToMany(() => Task, task => task.user_projects, {
        onDelete: "CASCADE"
    })
    tasks!: Task[];

}