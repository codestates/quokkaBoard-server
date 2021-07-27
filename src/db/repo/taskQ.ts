import { EntityRepository, Repository } from 'typeorm';
import { Task } from '../entity/Task';
import { TaskProps } from '../../types';


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

    findAssignee(data: TaskProps) {
        return this
        .createQueryBuilder('user_project')
        .leftJoinAndSelect('user_project.tasks', 'task')
        .getMany()
    }

    findTaskInBoard(id: string) {
        return this
        .createQueryBuilder("task")
        .innerJoin("task.board", "board", "boardId")
        .where("board.id = :id", {id: id})
        .orderBy("task.cIdx", "ASC")
        .getMany();
    }

}