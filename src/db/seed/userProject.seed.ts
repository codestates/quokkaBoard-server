import { Factory, Seeder } from "typeorm-seeding"
import { Connection } from "typeorm"
import { user } from "../../data/userData"
import { project } from "../../data/projectData"
import { defaultLabel } from "../../data/tagData"
import { User } from "../entity/User"
import { Project } from "../entity/Project"
import { UserProject } from "../entity/UserProject"
import { Tag } from "../entity/Tag"

export default class CreateUsers implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        
        const userSeed: object[] = [];
        user.forEach(el => {
            const newUser = new User();
            newUser.email = el.email;
            newUser.nickname = el.nickname;
            newUser.role = el.role
            newUser.password = el.password;
            newUser.hashPass();
            userSeed.push(newUser);
        })
        const findUser = await connection.getRepository(User).save(userSeed);
        const findProject = await connection.getRepository(Project).save(project);
        
        const labels: [{[key: string]: string}] = defaultLabel as any;
        const projectLabels: object[] = [];
        labels.forEach(label => 
            findProject.forEach(el => {
                label['projectId'] = el.id
                projectLabels.push(Object.assign({}, label))
            })
        );
        await connection.getRepository(Tag).save(projectLabels);

        const userProject = [
            { authority: "MASTER", userId: findUser[0].id, projectId: findProject[0].id },
            { authority: "MASTER", userId: findUser[0].id, projectId: findProject[1].id },
            { authority: "MASTER", userId: findUser[0].id, projectId: findProject[2].id },
            { authority: "MASTER", userId: findUser[1].id, projectId: findProject[3].id },
            { authority: "MASTER", userId: findUser[2].id, projectId: findProject[4].id },
            { authority: "ADMIN", userId: findUser[0].id, projectId: findProject[1].id },
            { authority: "ADMIN", userId: findUser[0].id, projectId: findProject[2].id },
            { authority: "ADMIN", userId: findUser[1].id, projectId: findProject[0].id },
            { authority: "ADMIN", userId: findUser[2].id, projectId: findProject[1].id }
        ];
        await connection.getRepository(UserProject).save(userProject);
    }
}   