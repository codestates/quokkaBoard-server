import "reflect-metadata";
import {Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToMany, ManyToOne} from "typeorm";
import {User} from "./User"
import {Project} from "./Project"

@Entity()
export class UserProject {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    authority!: string;

    @Column("uuid")
    userId!: string;

    @Column("uuid")
    projectId!: string;
   
    @ManyToOne(() => User, user => user.user_project, {primary: true, onDelete:'CASCADE'})
    user!: User;
    
    @ManyToOne(() => Project, project => project.user_project, {primary: true, onDelete:'CASCADE'})
    project!: Project;

}
