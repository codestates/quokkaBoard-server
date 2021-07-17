import "reflect-metadata";
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToMany, 
    ManyToOne, 
    JoinTable 
} from "typeorm";
import { Task } from "./Task";
import { UserProject } from "./UserProject";

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    comment!: string;

    @Column()
    taskId!: number;

    @ManyToOne(() => Task, task => task.comments, {
        primary:true, onDelete: "CASCADE"
    })
    task!: Task;

    @ManyToMany(() => UserProject, user_project => user_project.comments, {
        onDelete: "CASCADE"
    })
    @JoinTable({
        name: 'user_comment',
        joinColumn: {
            name: 'commentId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'user_projectId',
            referencedColumnName: 'id'
        }
    })
    user_projects!: UserProject[];

}
