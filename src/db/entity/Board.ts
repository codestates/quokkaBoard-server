import "reflect-metadata";
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column,
    ManyToOne,
    OneToMany, 
    CreateDateColumn, 
    UpdateDateColumn
} from "typeorm";
import { Project } from "./Project";
import { Task } from "./Task";


@Entity()
export class Board {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column('uuid')
    projectId!: string;

    @CreateDateColumn({ name: 'created_at'})
    created_at!: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updated_at!: Date;

    @ManyToOne(() => Project, project => project.board, {primary: true, onDelete:'CASCADE'})
    project!: Project;

    @OneToMany(() => Task, task => task.board)
    task!: Task[];

}
