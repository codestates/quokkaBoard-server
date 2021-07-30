import 'reflect-metadata'
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne 
} from 'typeorm'
import { User } from './User'


@Entity()
export class Follow {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('boolean' ,{default: false})
    registed!: boolean;

    @ManyToOne(() => User, user => user.following, {
        primary: true, onDelete:'CASCADE'
    })
    following!: User;

    @ManyToOne(() => User, user => user.follower, {
        primary: true, onDelete:'CASCADE'
    })
    follower!: User;
}