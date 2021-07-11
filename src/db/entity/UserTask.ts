import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToMany, ManyToOne } from "typeorm";
import { UserProject } from "./UserProject"
import { Task } from "./Task"

@Entity()
export class UserTask {

    @PrimaryGeneratedColumn()
    id!: number;
    
    @ManyToOne(() => UserProject, user_project => user_project.id) // {nullable: false, onDelete:'CASCADE'} 데이터 삭제 시, 외래키로 인해 삭제가 되지 않는 에러 해결을 위헤 ondelete 설정.
    user_project!: UserProject; // usertask -> userProject
    
    @ManyToOne(() => Task, task => task.id) // {nullable: false, onDelete:'CASCADE'})
    task!: Task;
   
}
