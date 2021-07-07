import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { FollowTable } from "./FollowTable";
// import { UserProject } from "./UserProject";
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

    @Column({ nullable: true, default: null })
    refresh_token?: string;

    @CreateDateColumn({ name: 'created_at'})
    created_at!: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updated_at!: Date;

    @OneToMany(() => FollowTable, followTable => followTable.userId)
    followTable!: FollowTable[];

//     @OneToMany(() => UserProject, user_project => user_project.user)
//     user_project!: UserProject[];

    hashPass() {
        this.password = bcrypt.hashSync(this.password, 8)
    }

    checkPass(password: string) {
        return bcrypt.compareSync(password, this.password)
    }

}
