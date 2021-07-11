import "reflect-metadata";
import { Entity, PrimaryColumn, Column, OneToOne, OneToMany, ManyToMany, ManyToOne } from "typeorm";
import { Task } from "./Task"
import { Tag } from "./Tag"


// 기능 구현 확인 후, @ManyToMany로 변경  
@Entity()
export class TaskTag {

    @PrimaryColumn() 
    labelId!: number;

    @Column()
    tagId!: number;
    
    @ManyToOne(() => Task, task => task.label_id) // {nullable: false, onDelete:'CASCADE'})
    task!: Task;
    
    @ManyToOne(() => Tag, tag => tag.id) // {nullable: false, onDelete:'CASCADE'})
    tag!: Tag;

}
