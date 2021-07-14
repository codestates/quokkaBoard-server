import { EntityRepository, Repository } from 'typeorm';
import { Task } from '@entity/Task';
import { NumProps, TaskProps } from '@types';
import { Board } from '@entity/Board';


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
        .select(['task.id', 'project.id'])
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

    joinTagToTask(labelId: number, tagId: number) {
        return this
        .createQueryBuilder()
        .relation(Task, "tags")
        .of(labelId)
        .add(tagId)
    }

    findTaskInBoard(id: number) {
        return this
        .createQueryBuilder("task")
        .innerJoin("task.board", "board", "boardId")
        .where("board.id = :id", {id: id})
        .orderBy("task.cIdx", "ASC")
        .getMany();
    }

    removeTaskToBoard(boardId: number, taskId: number) {
        return this
        .createQueryBuilder()
        .relation(Board, "tasks")
        .of(boardId)
        .remove(taskId)
    }

    joinTaskToBoard(boardId: number, taskId: number) {
        return this
        .createQueryBuilder()
        .relation(Board, "tasks")
        .of(boardId)
        .add(taskId)
    }

}