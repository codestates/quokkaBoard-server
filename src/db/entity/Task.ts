import "reflect-metadata";
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToMany, 
    ManyToMany, 
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { Tag } from "./Tag"
import { Comment } from "./Comment";
import { Project } from "./Project";
import { Board } from "./Board";


@Entity()
export class Task {

    @PrimaryGeneratedColumn() 
    id!: number;

    @Column()
    title!: string;

    @Column({nullable: true})
    description!: string;

    @Column()
    cIdx!: number;

    @Column({nullable: true})
    due_date!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @Column({unique: true}) 
    label_id!: number;

    @Column('uuid')
    projectId!: string;

    @ManyToOne(() => Project, project => project.tasks, {
        primary: true, onDelete: "CASCADE"
    })
    project!: Project;

    @OneToMany(() => Comment, comment => comment.task)
    comments!: Comment[];

    @ManyToMany(() => Board, board => board.tasks, {
        onDelete: "CASCADE"
    })
    board!: Board[];

    @ManyToMany(() => Tag, tag => tag.tasks)
    tags!: Tag[];

}
