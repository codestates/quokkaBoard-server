import "reflect-metadata";
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToMany, 
    ManyToMany, 
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinTable
} from "typeorm";
import { Board } from "./Board";
import { Tag } from "./Tag"
import { Comment } from "./Comment";
import { UserProject } from "./UserProject";;


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

    @Column()
    due_date!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @Column()
    boardId!: number;

    @Column({unique: true}) 
    label_id!: number;

    @ManyToOne(() => Board, board => board.tasks, {primary: true, onDelete: "CASCADE"})
    board!: Board;

    @ManyToMany(() => Tag, tag => tag.tasks)
    tags!: Tag[];

    @OneToMany(() => Comment, comment => comment.task)
    comments!: Comment[];
    
    @ManyToMany(() => UserProject, user_project => user_project.tasks, {onDelete: "CASCADE"})
    @JoinTable({
        name: 'user_project',
        joinColumn: {
            name: 'taskId',
            referencedColumnName:'id'
        },
        inverseJoinColumn: { //userProject 설정
            name:'user_projectId',
            referencedColumnName:'id'
        }
    })
    user_projects!: UserProject[];
    projectId!: string;
    cIdx: any;
}