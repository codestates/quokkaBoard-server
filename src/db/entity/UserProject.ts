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

    @Column()
    projectId!: number;

    @Column()
    authority!: string;
    
    @ManyToOne(() => User, user => user.userProject, {nullable: false, onDelete:'CASCADE'}) // 데이터 삭제 시, 외래키로 인해 삭제가 되지 않는 에러 해결을 위헤 ondelete 설정.
    user!: User;
    
    @ManyToOne(() => Project, project => project.userProject, {nullable: false, onDelete:'CASCADE'})
    project!: Project;

}
