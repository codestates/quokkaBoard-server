import { EntityRepository, Repository } from 'typeorm';
import { Task } from '../entity/Task';
import { TaskProps } from '../../types';
import { Board } from '../entity/Board';
import { UserProject } from '../entity/UserProject';


@EntityRepository(Task)
export class TaskRepo extends Repository <Task> {

    async getMaxIdx() {
        let idx = await this
        .createQueryBuilder('task')
        .select("MAX(task.cIdx)","max")
        .getRawOne();
        if(!idx.max) idx.max = 0;
        return idx.max;
    }
    
    findTask(data: TaskProps) {
        return this
        .createQueryBuilder("task")
        .where({id: data.taskId})
        .orWhere("task.cIdx = :cIdx", {cIdx: data.cIdx})
        .getOne();
    }

    findProjectInTask(data: TaskProps) {
        return this
        .createQueryBuilder('task')
        .innerJoin('task.project', 'project')
        .select([
            'task.id AS taskId', 
            'project.id AS projectId'
        ])
        .where({id: data.taskId})
        .getRawOne();
    }

    updateTask(data: TaskProps) {
        return this
        .createQueryBuilder("task")
        .update(Task)
        .set({
            title: data.title as string,
            description: data.description as string,
            due_date: data.dueDate as string,
        })
        .where({id: data.taskId})
        .execute();
    }

    joinTagToTask(labelId: number, tagId: string | string[]) {
        return this
        .createQueryBuilder()
        .relation(Task, "tags")
        .of(labelId)
        .add(tagId)
    }

    findAssignee(data: TaskProps) {
        return this
        .createQueryBuilder('user_project')
        .leftJoinAndSelect('user_project.tasks', 'task')
        .getMany()
    }

    taskAssignee(taskId: string, ids: UserProject[]) {
        return this
        .createQueryBuilder()
        .relation(Task, "user_projects")
        .of(taskId)
        .add(ids)
    }

    findTaskInBoard(id: string) {
        return this
        .createQueryBuilder("task")
        .innerJoin("task.board", "board", "boardId")
        .where("board.id = :id", {id: id})
        .orderBy("task.cIdx", "ASC")
        .getMany();
    }

    joinTaskToBoard(boardId: string, taskId: string | string[]) {
        return this
        .createQueryBuilder()
        .relation(Board, "tasks")
        .of(boardId)
        .add(taskId)
    }

    checkTask(taskId: string, bool: boolean) {
        return this
        .createQueryBuilder("task")
        .update(Task)
        .set({completed: bool})
        .where({id: taskId})
        .execute();
    }

}