import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToMany, ManyToOne } from "typeorm";
import { FollowTable } from "./FollowTable";
import { UserProject } from "./UserProject";
import bcrypt from "bcrypt";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid') //auto-increment 기능포함
    id!: string;

    @Column({
        length: 15
    })
    name!: string;

    @Column()
    email!: string;

    @Column()
    role!: string;

    @Column()
    nickname!: string;

    @Column()
    password!: string;

    @Column("mediumblob", { // ()
        nullable: true
    })
    image!: string;

    @OneToMany(() => FollowTable, followTable => followTable.userId)
    followTable!: FollowTable[];

    @OneToMany(() => UserProject, userProject => userProject.user)
    userProject!: UserProject[];

    hashPass() {
        this.password = bcrypt.hashSync(this.password, 8)
    }

    checkPass(password: string) {
        return bcrypt.compareSync(password, this.password)
    }

}
