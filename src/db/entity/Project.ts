import 'reflect-metadata'
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToMany 
} from 'typeorm'
import { Tag } from './Tag'
import { Task } from './Task'
import { Board } from './Board'
import { UserProject } from './UserProject'


@Entity()
export class Project {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column({nullable: true})
    description!: string;

    @Column({nullable: true})
    start_date!: Date;

    @Column({nullable: true})
    end_date!: Date;

    @OneToMany(() => UserProject, user_project => user_project.project)
    user_project!: UserProject[];

    @OneToMany(() => Task, task => task.project)
    tasks!: Task[];

    @OneToMany(() => Board, board => board.project)
    boards!: Board[];

    @OneToMany(() => Tag, tag => tag.project)
    tags!: Tag[];

}