import { Response } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import { Board } from '@entity/Board';
import { typeReq, strProps, boardProps } from '@types';
import { BoardRepo } from '@repo/boardQ';


const kanban = {

    createBoard: async (req: typeReq<strProps>, res: Response) => {
        
        const { projectId, boardTitle } = req.body;
        const boardRepo = getRepository(Board);
        try {
            const newBoard = new Board();
            newBoard.title = boardTitle;
            newBoard.projectId = projectId;
            const findBoard = await boardRepo.save(newBoard);

            res.status(200).send({ success: true, columnIndex: findBoard.column_index });
        } catch (e) {
            res.status(202).send({ success: false });
        }
        
    },

    removeBoard: async (req: typeReq<boardProps>, res: Response) => {

        const boardRepo = getCustomRepository(BoardRepo);
        try {
            const findBoard = await boardRepo.findBoard(req.body.boardId);
            boardRepo.delete({ id: findBoard.id });

            res.status(200).send({ success: true, leftTasksId: [] });
        } catch (e) {
            res.status(202).send({ success: false });
        }
        
        /* temptable 구성 시 쿼리 */
        // getrepo => getCustomRepo를 통해 조인쿼리를 만들어서 boardId밑에 종속된
        // 모든 task를 불러 올것
        // 불러온 태스크들은 temptable을 getrepo로 가져와서 삽입
        // 그리고 삭제 후 200 응답

    },

    updateBoard: async (req: typeReq<boardProps>, res: Response) => {
        
        const { boardId, boardTitle } = req.body;
        const boardRepo = getCustomRepository(BoardRepo);
        try {
            const title = boardTitle as string;
            const findBoard = await boardRepo.findBoard(boardId);
            boardRepo.updateTilte(findBoard.id, title);
            
            res.status(200).send({ success: true });
        } catch (e) {
            res.status(202).send({ success: false });
        }

    },

    shiftBoard: async (req: typeReq<boardProps>, res: Response) => {
    
    
    }

}

export default kanban;