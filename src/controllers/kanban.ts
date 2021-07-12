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
            const customBoardRepo = getCustomRepository(BoardRepo);
            const uniqNum = await customBoardRepo.getMaxIdx();
        
            const newBoard = new Board();
            newBoard.title = boardTitle;
            newBoard.projectId = projectId;
            newBoard.bIdx = uniqNum + 1;
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
            const findBoard = await boardRepo.findBoard(req.body);
            if(!findBoard) throw Error;
            const findTask = await boardRepo.findTaskInBoard(req.body);
            console.log(findTask)
            // boardRepo.delete({id: findBoard.id});
            
            res.status(200).send({ 
                success: true, 
                leftTasksId: [] 
            });
        } catch (e) {
            res.status(202).send({ 
                success: false,
                message: '보드가 존재하지 않습니다'
            });
        }    
    },

    updateBoard: async (req: TypeReq<StrNumProps>, res: Response) => {
        try {
            const boardRepo = getCustomRepository(BoardRepo);
            const findBoard = await boardRepo.findBoard(req.body);
            if(!findBoard) throw Error;

            boardRepo.updateTitle(req.body);
            res.status(200).send({
                success: true,
                message: '타이틀이 변경 되었습니다'
            });
        } catch (e) {
            res.status(202).send({
                success: false,
                message: '보드가 존재하지 않습니다' 
            });
        }
    },

    shiftBoard: async (req: TypeReq<StrProps>, res: Response) => {
        
    }

}

export default kanban;