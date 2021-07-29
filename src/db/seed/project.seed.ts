import Faker from 'faker'
import { Factory, Seeder, define } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { User } from '../entity/User'
import { Follow } from '../entity/Follow'
import { Project } from '../entity/Project'
import { Tag } from '../entity/Tag'
import { UserProject } from '../entity/UserProject'
import { Board } from '../entity/Board'
import { Task } from '../entity/Task'
import { defaultLabel } from '../data/tagData'
import { UpdateRepo } from '../repo/updateQ'
import { selectRandElement } from '../../util/rand'


export default class CreateSeeds implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        
        /* User Seed */
        let passNum = 0;
        define(User, (faker: typeof Faker) => {
            passNum === 0 ? passNum++ : passNum--;

            const user = new User();
            user.email = faker.internet.email();
            user.nickname = faker.name.findName();
            user.role = 'NORMAL';
            user.password = passNum.toString();
            user.hashPass();
            return user;
        });
        const findUser = await factory(User)().createMany(20);

        /* Follow Seed */
        for(let i=0; i<findUser.length; i=i+4) {
            for(let j=i+1; j<=i+3; j++) {
                await connection.getRepository(Follow).save({
                    following: findUser[i],
                    follower: findUser[j]
                });
            }
        }

        /* Project Seed */
        define(Project, (faker: typeof Faker) => {
            const project = new Project();
            project.title = faker.company.companyName();
            project.description = faker.company.companySuffix();
            project.start_date = faker.date.between('2021-07-01', '2021-08-31')
            project.end_date = faker.date.future();
            return project;
        });
        const findProject = await factory(Project)().createMany(5);
        
        /* Tag Seed */
        const labels: [{[key: string]: string}] = defaultLabel as any;
        const projectLabels: object[] = [];
        labels.forEach(label => 
            findProject.forEach(el => {
                label['projectId'] = el.id
                projectLabels.push(Object.assign({}, label))
            })
        );
        await connection.getRepository(Tag).save(projectLabels);

        /* UserProject seed */
        const copyUser = findUser.slice();
        for(let i=0; i < findProject.length; i++) {
            let users = copyUser.splice(0, 4);
            const userData: object[] = [];
            users.forEach(el => {
                userData.push({
                    authority: 'ADMIN',
                    userId: el.id,
                    projectId: findProject[i].id
                });
            });
            await connection.getRepository(UserProject)
                .createQueryBuilder("user_project")
                .insert()
                .into(UserProject)
                .values(userData)
                .execute();
        }
        for(let i=0; i < findProject.length; i++) {
            let users = await connection.getRepository(UserProject).find({
                where: {projectId: findProject[i]}
            });
            users[0].authority = 'MASTER';
            users[2].authority = 'WRITE';
            users[3].authority = 'WRITE';
            await connection.getRepository(UserProject).save(users);
        }

        /* Board Seed */
        for(let el of findProject) {
            let boardIdx = 0;
            define(Board, (faker: typeof Faker) => {
                boardIdx = boardIdx + 1;
                const board = new Board();
                board.title = faker.name.jobTitle();
                board.bIdx = boardIdx;
                board.projectId = el.id
                return board;
            });
            await factory(Board)().createMany(4);
        }
        
        /* Task Seed */
        let bool;
        let uniqNum = 0;
        const findBoard = await connection.getRepository(Board).find();
        for(let el of findBoard) {
            define(Task, (faker: typeof Faker) => {
                uniqNum = uniqNum + 1;
                Math.random() <= 0.5 ? bool = true : bool = false;

                const task = new Task();
                task.title = faker.company.catchPhrase();
                task.description = faker.company.catchPhraseDescriptor();
                task.cIdx = uniqNum;
                task.due_date = faker.date.between('2021-07-01', '2021-12-31');
                task.label_id = uniqNum;
                task.completed = bool;
                task.projectId = el.projectId;
                return task;
            });
            const findTask = await factory(Task)().createMany(4);
        
        /* BoardTask Seed */
            const taskIds = findTask.map(el => el.id);
            await connection.getCustomRepository(UpdateRepo).joinTaskToBoard(el.id, taskIds);
            
        /* UserTask Seed */
        /* TaskTag Seed */
            const findUserProject = await connection.getRepository(UserProject)
                .find({where: {projectId: el.projectId}});
            const findTag = await connection.getRepository(Tag)
                .find({
                    select: ["id"],
                    where: {projectId: el.projectId}
                });
            for(let i=0; i<findTask.length; i++) {
                await connection.getRepository(Task).createQueryBuilder()
                    .relation(Task, "user_projects")
                    .of(findTask[i].id)
                    .add(findUserProject[i].id);
                await connection.getRepository(Task).createQueryBuilder()
                    .relation(Task, "tags")
                    .of(findTask[i].label_id)
                    .add(selectRandElement(findTag))
            }
        }
    }
}   