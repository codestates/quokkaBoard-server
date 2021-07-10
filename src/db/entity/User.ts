import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { UserProject } from "./UserProject";
import { Follow } from "./Follow";
import bcrypt from "bcrypt";


@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid') //auto-increment 기능포함
    id!: string;

    @Column()
    nickname!: string;

    @Column()
    email!: string;

    @Column({ nullable: true })
    role!: string;

    @Column()
    password!: string;

    @Column("mediumblob", { // ()
        nullable: true
    })
    image!: string;

    @Column({ nullable: true })
    refresh_token?: string;

    @CreateDateColumn({ name: 'created_at'})
    created_at!: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updated_at!: Date;

    @OneToMany(() => UserProject, user_project => user_project.user)
    user_project!: UserProject[];

    @OneToMany(() => Follow, follow => follow.following)
    following!: Follow[];

    @OneToMany(() => Follow, follow => follow.follower)
    follower!: Follow[];

    // @ManyToMany(() => User, user => user.following, {
    //     cascade: ['insert', 'recover', 'remove', 'update']
    // })
    // @JoinTable()
    // follow!: User[];

    // @ManyToMany(() => User, user => user.follow, {
    //     cascade: ['insert', 'recover', 'update']
    // })
    // following!: User[];

    hashPass() {
        this.password = bcrypt.hashSync(this.password, 8)
    }

    checkPass(password: string) {
        return bcrypt.compareSync(password, this.password)
    }

}
