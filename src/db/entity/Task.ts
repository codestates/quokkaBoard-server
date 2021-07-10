import "reflect-metadata";
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToMany, 
    ManyToMany, 
    ManyToOne } from "typeorm";
import { Board } from "./Board";
// import { TempBoard } from "./TempBoard";
// import { UserTask } from "./UserTask";
// import { Comment } from "./Comment";
// import { TaskTag } from "./TaskTag";

@Entity()
export class Task {

    @PrimaryGeneratedColumn() 
    id!: number;

    @Column()
    title!: string;

    @Column()
    description!: string;

    @Column()
    boardId!: number;

    @Column()
    row_index!: number;

    @Column()
    due_date!: Date;

    @Column()
    comment_id!: number;

    @Column() 
    label_id!: number;

    @Column()
    created_at!: Date;

    @Column()
    updated_at!: Date;

    @Column()
    temp_id!: number;

    @ManyToOne(() => Board, board => board.id)
    board!: Board;

    // @ManyToOne(() => TempBoard, tempBoard => tempBoard.id)
    // tempBoard!: TempBoard; // task -> tempBoard
    
    // @OneToMany(() => UserTask, userTask => userTask.taskId)
    // userTask!: UserTask[]; // task -> userTask

    // @OneToMany(() => Comment, comment => comment.commentId)
    // comment!: Comment[]; // task -> comment

    // @OneToMany(() => TaskTag, taskTag => taskTag.labelId)
    // taskTag!: TaskTag[]; // task -> taskTags

}
