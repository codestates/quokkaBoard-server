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
import { Board } from "./Board";
import { Tag } from "./Tag"
import { Comment } from "./Comment";

@Entity()
export class Task {

    @PrimaryGeneratedColumn() 
    id!: number;

    @Column()
    title!: string;

    @Column({nullable: true})
    description!: string;

    @Column()
    index!: number;

    @Column({nullable: true})
    due_date!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @Column()
    boardId!: number;

    @Column({unique: true}) 
    label_id!: number;

    @ManyToOne(() => Board, board => board.task, {primary: true})
    board!: Board;

    @ManyToMany(() => Tag, tag => tag.tasks)
    tags!: Tag[];

    @OneToMany(() => Comment, comment => comment.task)
    comments!: Comment[];

    // @OneToMany(() => UserTask, userTask => userTask.taskId)
    // userTask!: UserTask[]; // task -> userTask

}
