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

    @Column({nullable: true})
    description!: string;

    @Column({unique: true})
    index!: number;

    @Column({nullable: true})
    due_date!: string;

    @Column()
    created_at!: Date;

    @Column()
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

    // @ManyToOne(() => TempBoard, tempBoard => tempBoard.id)
    // tempBoard!: TempBoard; // task -> tempBoard
    
    // @OneToMany(() => UserTask, userTask => userTask.taskId)
    // userTask!: UserTask[]; // task -> userTask

    // @OneToMany(() => Comment, comment => comment.commentId)
    // comment!: Comment[]; // task -> comment

    // @OneToMany(() => TaskTag, taskTag => taskTag.labelId)
    // taskTag!: TaskTag[]; // task -> taskTags

}
