import { EntityRepository, Repository } from 'typeorm';
import { Board } from '@entity/Board';


@EntityRepository(Board)
export class BoardRepo extends Repository <Board> {

    findBoard(boardId: string | number) {
        return this.createQueryBuilder("board")
        .where({id: boardId})
        .getOneOrFail();
    }

    updateTilte(boardId: number, title: string) {
        return this.createQueryBuilder("board")
        .update(Board)
        .set({title: title})
        .where({id: boardId})
        .execute();
    }

}