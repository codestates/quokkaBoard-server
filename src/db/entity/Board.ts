import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, Generated } from "typeorm";
import { Project } from "./Project";


@Entity()
export class Board {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column('uuid')
    projectId!: string;

    @CreateDateColumn({ name: 'created_at'})
    created_at!: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updated_at!: Date;

    @ManyToOne(() => Project, project => project.board, {primary: true, onDelete:'CASCADE'})
    project!: Project;

}
