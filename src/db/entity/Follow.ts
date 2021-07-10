import "reflect-metadata";
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    CreateDateColumn, 
    UpdateDateColumn 
} from "typeorm";
import { User } from "./User";


@Entity()
export class Follow {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('boolean' ,{default: false})
    registed!: boolean;

    @CreateDateColumn({ name: 'created_at'})
    created_at!: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updated_at!: Date;

    @ManyToOne(() => User, user => user.following, {
        primary: true, onDelete:'CASCADE'
    })
    following!: User;

    @ManyToOne(() => User, user => user.follower, {
        primary: true, onDelete:'CASCADE'
    })
    follower!: User;
}