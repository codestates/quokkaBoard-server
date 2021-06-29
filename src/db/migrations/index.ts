import "reflect-metadata";
import { urlencoded } from "express";
import {createConnection} from "typeorm";
import { FollowTable } from "@entity/FollowTable";
import { User } from "@entity/User";
import { UserProject } from "@entity/UserProject";
import { Project } from "@entity/Project";

createConnection({
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "woo1988",
    database: "quokkaBoard",
    entities: [
        User, Project, FollowTable, UserProject
    ],
    synchronize: true,
    logging: false
})
.then(async connection => {

    let user = new User();
    user.nickname = "SashaInSPb";
    user.name = "Sasha";
    user.email = "88parksw@gmail.com";
    user.role = "Intern";
    user.password = "password",
    // user.image = "dwqdqdq" 

    await connection.manager.save(user);

    console.log("Photo has been saved");
    // const users = await connection.manager.find(User);
}).catch(error => console.log(error));
