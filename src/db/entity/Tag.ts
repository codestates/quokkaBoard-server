import "reflect-metadata";
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToMany, 
    JoinTable 
} from "typeorm";
import { Task } from '@entity/Task';


@Entity()
export class Tag {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    content!: string;

    @Column()
    hex!: string; 
    
    @ManyToMany(() => Task, task => task.tags)
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
