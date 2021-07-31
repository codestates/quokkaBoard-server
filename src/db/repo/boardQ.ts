import { EntityRepository, Repository } from 'typeorm'
import { Board } from '../entity/Board'


@EntityRepository(Board)
export class BoardRepo extends Repository <Board> {

    findBoard(boardId: string) {
        return this
        .createQueryBuilder("board")
        .where({id: boardId})
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

    findTaskOnly(boardId: string) {
        return this
        .createQueryBuilder("board")
        .innerJoinAndSelect("board.tasks", "task")
        .select(["task"])
        .where({id: boardId})
        .orderBy("task.cIdx", "ASC")
        .getRawMany();
    }

    findAllBoard(id: string) {
        return this
        .createQueryBuilder("board")
        .leftJoinAndSelect("board.tasks", "task")
        .select(['board', 'task', 'task.id'])
        .where({projectId: id})
        .orderBy("board.bIdx", "ASC")
        .addOrderBy("task.cIdx", "ASC")
        .getMany();
    }
    
}