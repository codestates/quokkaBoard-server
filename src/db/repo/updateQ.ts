import { EntityRepository, Repository } from 'typeorm';
import { Task } from '../entity/Task';
import { Board } from '../entity/Board';
import { UserProject } from '../entity/UserProject';
import { StrProps } from '../../types';


@EntityRepository(Task)
export class UpdateRepo extends Repository <Task> {
    
    updateTask(data: StrProps) {
        return this
        .createQueryBuilder("task")
        .update(Task)
        .set({
            title: data.title,
            description: data.description,
            due_date: data.dueDate,
        })
        .where({id: data.taskId})
        .execute();
    }

    joinTagToTask(labelId: number, tagId: string) {
        return this
        .createQueryBuilder()
        .relation(Task, "tags")
        .of(labelId)
        .add(tagId)
    }

    joinTaskToBoard(boardId: string, taskId: string | string[]) {
        return this
        .createQueryBuilder()
        .relation(Board, "tasks")
        .of(boardId)
        .add(taskId)
    }

    taskAssignee(taskId: string, ids: UserProject[]) {
        return this
        .createQueryBuilder()
        .relation(Task, "user_projects")
        .of(taskId)
        .add(ids)
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