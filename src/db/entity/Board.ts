import "reflect-metadata";
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { Project } from "./Project";
import { Task } from "./Task"


@Entity()
export class Board {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    bIdx!: number;

    @Column('uuid')
    projectId!: string;

    @ManyToOne(() => Project, project => project.boards, {
        primary: true, onDelete:'CASCADE'
    })
    project!: Project;

    @ManyToMany(() => Task, task => task.board, {
        onDelete: "CASCADE"
    })
    @JoinTable({
        name: 'board_task',
        joinColumn: {
            name: 'boardId', 
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'taskId',
            referencedColumnName: 'id'
        }
    })
    tasks!: Task[];

}
