import { Factory, Seeder } from "typeorm-seeding"
import { Connection, getCustomRepository } from "typeorm"
import { user } from "../../data/userData"
import { project } from "../../data/projectData"
import { defaultLabel } from "../../data/tagData"
import { board, task } from "../../data/boardData"
import { User } from "../entity/User"
import { Project } from "../entity/Project"
import { UserProject } from "../entity/UserProject"
import { Board } from "../entity/Board"
import { Task } from "../entity/Task"
import { Tag } from "../entity/Tag"
import { TaskRepo } from "../repo/taskQ"

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
            { authority: "ADMIN", userId: findUser[0].id, projectId: findProject[3].id },
            { authority: "ADMIN", userId: findUser[0].id, projectId: findProject[4].id },
            { authority: "ADMIN", userId: findUser[1].id, projectId: findProject[0].id },
            { authority: "ADMIN", userId: findUser[2].id, projectId: findProject[1].id }
        ];
        await connection.getRepository(UserProject).save(userProject);

        const boardSeed: object[] = [];
        for(let i=0; i < findProject.length; i++) {     
            let uniqNum = 0;
            board.forEach(el => {
                uniqNum = uniqNum + 1;
                const newBoard = new Board();
                newBoard.title = el.title;
                newBoard.bIdx = uniqNum;
                newBoard.projectId = findProject[i].id
                boardSeed.push(newBoard);
            });
        }
        const findBoard = await connection.getRepository(Board).save(boardSeed);

        let taskSeed: object[] = [];
        let labelNum = 0
        for(let i=0; i < findBoard.length; i++) {
            let uniqNum = 0;
            task.forEach(el => {
                uniqNum = uniqNum + 1;
                labelNum = labelNum + 1;
                const newTask = new Task();
                newTask.title = el.title;
                newTask.description = el.description;
                newTask.cIdx = uniqNum;
                newTask.due_date = el.due_date;
                newTask.label_id = labelNum;
                newTask.projectId = findBoard[i].projectId;
                newTask.completed = el.completed;
                taskSeed.push(newTask);
            });
            const findTask = await connection.getRepository(Task).save(taskSeed);
            const taskIds = findTask.map(el => el.id);
            await connection.getCustomRepository(TaskRepo).joinTaskToBoard(findBoard[i].id, taskIds)
            taskSeed = [];
        }
    }
}   