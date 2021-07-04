import "reflect-metadata";
import {Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToMany, ManyToOne} from "typeorm";
import {User} from "./User"
import {Project} from "./Project"

@Entity()
export class UserProject {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column("uuid")
    userId!: string;

    @Column("uuid")
    projectId!: string;

    @Column()
    authority!: string;
    
    @ManyToOne(() => User, user => user.userProject)
    user!: User;
    
    @ManyToOne(() => Project, project => project.userProject)
    project!: Project;

}
