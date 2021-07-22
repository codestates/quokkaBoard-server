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
import { UserProject } from "./UserProject";
import { Project } from "./Project"


@Entity()
export class Task {

    @PrimaryGeneratedColumn('uuid') 
    id!: string;

    @Column()
    title!: string;

    @Column({nullable: true})
    description!: string;

    @Column()
    cIdx!: number;

    @Column({nullable: true})
    due_date!: string;

    @Column('boolean' ,{default: false})
    completed!: boolean;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @Column({unique: true}) 
    label_id!: number;

    @Column('uuid') 
    projectId!: string;

    @ManyToMany(() => Board, board => board.tasks, {
        onDelete: "CASCADE"
    })
    board!: Board[];

    @ManyToMany(() => Tag, tag => tag.tasks, {
        onDelete: "CASCADE"
    })
    tags!: Tag[];

    @OneToMany(() => Comment, comment => comment.task)
    comments!: Comment[];

    @ManyToOne(() => Project, project => project.tasks, {
        primary: true, onDelete:'CASCADE'
    })
    project!: Project;
    
    @ManyToMany(() => UserProject, user_project => user_project.tasks, {
        onDelete: "CASCADE"
    })
    @JoinTable({
        name: 'user_task',
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
    
}

