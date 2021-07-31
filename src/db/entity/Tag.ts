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
export class Tag {

    @PrimaryGeneratedColumn() 
    id!: number;

    @Column({nullable: true})
    content!: string;

    @Column({nullable: true})
    hex!: string;

    @Column("uuid")
    projectId!: string;

    @ManyToOne(() => Project, project => project.tags, {
        onDelete: "CASCADE"
    })
    project!: Project
    
    @ManyToMany(() => Task, task => task.tags, {
        onDelete: "CASCADE"
    })
    @JoinTable({
        name: 'task_tag',
        joinColumn: {
            name: 'tagId', 
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'labelId',
            referencedColumnName: 'label_id'
        }
    })
    tasks!: Task[];

}
