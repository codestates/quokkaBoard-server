import 'reflect-metadata'
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable
} from 'typeorm'
import { Task } from './Task'
import { Project } from './Project'


@Entity()
export class Board {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

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
