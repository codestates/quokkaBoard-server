import "reflect-metadata";
import { Entity, PrimaryColumn, Column, OneToOne, OneToMany, ManyToMany, ManyToOne } from "typeorm";
// import { TaskTag } from "./TaskTag"

// 기능 구현 확인 후, @ManyToMany로 변경  
@Entity()
export class Tag {

    @PrimaryColumn() 
    id!: number;

    @Column()
    content!: string;

    @Column()
    hex!: string; 
    
    // @OneToMany(() => TaskTag, taskTag => taskTag.tagId)
    // taskTag!: TaskTag[]; // tag -> taskTag
    
}
