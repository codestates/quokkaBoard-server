import { EntityRepository, Repository } from 'typeorm';
import { Board } from '@entity/Board';
import { StrArrProps, StrProps } from '@types';


@EntityRepository(Board)
export class BoardRepo extends Repository <Board> {

    findBoard(data: StrArrProps) {
        return this
        .createQueryBuilder("board")
        .where({id: data.boardId as string})
        .getOne();
    }

    async getMaxIdx() {
        let idx = await this
        .createQueryBuilder("board")
        .select("MAX(board.bIdx)","max")
        .getRawOne();
        if(!idx.max) idx.max = 0;
        return idx.max;
    }

    findTaskOnly(data: StrProps) {
        return this
        .createQueryBuilder("board")
        .innerJoinAndSelect("board.tasks", "task")
        .select(["task"])
        .where({id: data.boardId})
        .orderBy("task.cIdx", "ASC")
        .getRawMany();
    }

    updateTitle(data: StrProps) {
        return this
        .createQueryBuilder("board")
        .update(Board)
        .set({title: data.boardTitle})
        .where({id: data.boardId})
        .execute();
    }

    joinTaskToBoard(boardId: string, taskId: string) {
        return this
        .createQueryBuilder()
        .relation(Board, "tasks")
        .of(boardId)
        .add(taskId)
    }

    findAllBoard(id: string) {
        return this
        .createQueryBuilder("board")
        .leftJoinAndSelect("board.tasks", "task")
        .select(['board', 'task', 'task.id'])
        .where({projectId: id})
        .orderBy("board.bIdx", "ASC")
        .getMany();
    }
}