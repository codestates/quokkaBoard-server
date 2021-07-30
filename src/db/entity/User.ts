import 'reflect-metadata'
import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm'
import { Follow } from './Follow'
import { UserProject } from './UserProject'
import bcrypt from 'bcrypt'


@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    nickname!: string;

    @Column()
    email!: string;

    @Column({nullable: true})
    role!: string;

    @Column()
    password!: string;

    @Column("mediumblob", {nullable: true})
    image!: string;

    @Column({nullable: true})
    refresh_token?: string;

    @CreateDateColumn({name: 'created_at'})
    created_at!: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updated_at!: Date;

    @OneToMany(() => UserProject, user_project => user_project.user)
    user_project!: UserProject[];

    @OneToMany(() => Follow, follow => follow.following)
    following!: Follow[];

    @OneToMany(() => Follow, follow => follow.follower)
    follower!: Follow[];

    hashPass() {
        this.password = bcrypt.hashSync(this.password, 8)
    }

    checkPass(password: string) {
        return bcrypt.compareSync(password, this.password)
    }

}
