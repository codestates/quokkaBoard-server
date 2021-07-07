import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToMany, ManyToOne } from "typeorm";
import { UserProject } from "./UserProject";


@Entity()
export class User {

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

    // @OneToMany(() => UserProject, userProject => userProject.user)
    // userProject!: UserProject[];


}
