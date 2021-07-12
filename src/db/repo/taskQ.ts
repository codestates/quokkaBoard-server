import { EntityRepository, Repository } from 'typeorm';
import { Task } from '@entity/Task';
import { TaskProps } from '@types';
import { Board } from '@entity/Board';


@EntityRepository(Task)
export class TaskRepo extends Repository <Task> {

    async getMaxIdx() {
        let idx = await this
        .createQueryBuilder('task')
        .select("MAX(task.index)","max")
        .getRawOne();
        if(!idx.max) idx.max = 0;
        return idx.max;
    }
    
    findTask(data: TaskProps) {
        return this
        .createQueryBuilder("task")
        .where({id: data.taskId})
        .getOne();
    }

    findProjectInTask(data: TaskProps) {
        return this
        .createQueryBuilder('task')
        .innerJoin('task.board', 'board')
        .innerJoin('board.project', 'project')
        .select(['task.id', 'board.id', 'project.id'])
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

}