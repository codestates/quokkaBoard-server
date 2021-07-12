import "reflect-metadata";
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToMany,
    ManyToOne,
    JoinTable 
} from "typeorm";
import { Task } from '@entity/Task';
import { Project } from "./Project";

// 기능 구현 확인 후, @ManyToMany로 변경  
@Entity()
export class Tag {

    @PrimaryColumn() 
    id!: number;

    @Column({nullable: true})
    content!: string;

    @Column({nullable: true})
    hex!: string;

    @Column("uuid")
    projectId!: string;

    @ManyToOne(() => Project, project => project.tags, {onDelete: "CASCADE"})
    project!: Project
    
    @ManyToMany(() => Task, task => task.tags, {onDelete: "CASCADE"})
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
