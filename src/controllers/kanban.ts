import { Response } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import { Board } from '@entity/Board';
import { TypeReq, StrProps, StrNumProps } from '@types';
import { BoardRepo } from '@repo/boardQ';


const kanban = {

    createBoard: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const { projectId, boardTitle } = req.body;
            const boardRepo = getRepository(Board);
        
            const newBoard = new Board();
            newBoard.title = boardTitle;
            newBoard.projectId = projectId;
            const findBoard = await boardRepo.save(newBoard);

            res.status(200).send({ 
                success: true, 
                boardId: findBoard.id 
            });
        } catch (e) {
            res.status(202).send({ 
                success: false,
                message: '잘못된 프로젝트 정보입니다' 
            });
        }
    },

    removeBoard: async (req: TypeReq<StrNumProps>, res: Response) => {
        try {
            const boardRepo = getCustomRepository(BoardRepo);
            const findBoard = await boardRepo.findBoard(req.body.boardId);
            boardRepo.delete({id: findBoard.id});
            
            res.status(200).send({ 
                success: true, 
                leftTasksId: [] 
            });
        } catch (e) {
            res.status(202).send({ 
                success: false,
                message: '잘못된 요청입니다'
            });
        }    
        /* temptable 구성 시 쿼리, 또는 트랜잭션 활용 */
        // getrepo => getCustomRepo를 통해 조인쿼리를 만들어서 boardId밑에 종속된
        // 모든 task를 불러 올것
        // 불러온 태스크들은 temptable을 getrepo로 가져와서 삽입
        // 그리고 삭제 후 200 응답
    },

    updateBoard: async (req: TypeReq<StrNumProps>, res: Response) => {
        try {
            const { boardId, boardTitle } = req.body;
            const boardRepo = getCustomRepository(BoardRepo);
        
            const title = boardTitle as string;
            const findBoard = await boardRepo.findBoard(boardId);
            boardRepo.updateTilte(findBoard.id, title);
            
            res.status(200).send({
                success: true,
                message: '타이틀이 변경 되었습니다'
            });
        } catch (e) {
            res.status(202).send({
                success: false,
                message: '잘못된 요청입니다' 
            });
        }
    },

    shiftBoard: async (req: TypeReq<StrProps>, res: Response) => {
    
    
    }

}

export default kanban;