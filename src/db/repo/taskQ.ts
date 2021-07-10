import { EntityRepository, Repository } from 'typeorm';
import { Task } from '@entity/Task';
import { TaskProps } from '@types';


@EntityRepository(Task)
export class TaskRepo extends Repository <Task> {

    async getMaxIdx() {
        const allIdx: any[] = await this.createQueryBuilder('task')
        .select(['task.index'])
        .getMany();
        return Math.max(...allIdx)
    }
    
    findTask(data: TaskProps) {
        return this.createQueryBuilder("task")
        .where({id: data.taskId})
        .getOne();
    }

    updateTask(id: number, data: object) {
        return this.createQueryBuilder("task")
        .update(Task)
        .set(data)
        .where({id: id})
        .execute();
    }

}