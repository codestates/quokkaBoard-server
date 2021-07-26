import { EntityRepository, Repository } from 'typeorm';
import { Task } from '../entity/Task';
import { Board } from '../entity/Board';
import { UserProject } from '../entity/UserProject';
import { StrProps } from '../../types';


@EntityRepository(Board)
export class updateBoard extends Repository <Board> {
    
    joinTaskToBoard(boardId: string, taskId: string) {
        return this
        .createQueryBuilder()
        .relation(Board, "tasks")
        .of(boardId)
        .add(taskId)
    }
    
}

@EntityRepository(Task)
export class updateTask extends Repository <Task> {
    
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

    joinTagToTask(labelId: number, tagId: string | string[]) {
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