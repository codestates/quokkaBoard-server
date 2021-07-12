import { EntityRepository, Repository } from 'typeorm';
import { Board } from '@entity/Board';
import { StrNumProps } from '@types';


@EntityRepository(Board)
export class BoardRepo extends Repository <Board> {

    findBoard(data: StrNumProps) {
        return this
        .createQueryBuilder("board")
        .where({id: data.boardId})
        .getOne();
    }

    async getMaxIdx() {
        let idx = await this
        .createQueryBuilder('board')
        .select("MAX(board.cIdx)","max")
        .getRawOne();
        if(!idx.max) idx.max = 0;
        return idx.max;
    }

    findTaskInBoard(data: StrNumProps) {
        return this
        .createQueryBuilder("board")
        .innerJoin('board.board_task', 'board_task')
        .innerJoin('board_task.task', 'task')
        .select(['board.id', 'board_task', 'task.id'])
        .where({id: data.boardId})
        .getRawMany();
    }

    updateTitle(data: StrNumProps) {
        return this
        .createQueryBuilder("board")
        .update(Board)
        .set({title: data.boardTitle as string})
        .where({id: data.boardId})
        .execute();
    }

}