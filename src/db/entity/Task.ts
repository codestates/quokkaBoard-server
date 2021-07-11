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
// import { TempBoard } from "./TempBoard";
// import { Comment } from "./Comment";

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
    comment_id!: number;

    @Column({unique: true}) 
    label_id!: number;

    // @Column()
    // temp_id!: number;

    @ManyToOne(() => Board, board => board.task, {primary: true, onDelete: 'CASCADE'})
    board!: Board;

    @ManyToMany(() => Tag, tag => tag.tasks)
    tags!: Tag[];

    // @ManyToOne(() => TempBoard, tempBoard => tempBoard.id)
    // tempBoard!: TempBoard; // task -> tempBoard
    
    // @OneToMany(() => UserTask, userTask => userTask.taskId)
    // userTask!: UserTask[]; // task -> userTask

    // @OneToMany(() => Comment, comment => comment.commentId)
    // comment!: Comment[]; // task -> comment

}
