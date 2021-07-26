import { Response } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import { Board } from '../db/entity/Board';
import { TypeReq, StrProps, NumProps } from '../types';
import { BoardRepo } from '../db/repo/boardQ';


const kanban = {

    createBoard: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const { projectId, boardTitle } = req.body;
            const boardRepo = getCustomRepository(BoardRepo);
            const uniqNum = await boardRepo.getMaxIdx();
            
            const newBoard = new Board();
            newBoard.title = boardTitle;
            newBoard.projectId = projectId;
            newBoard.bIdx = uniqNum + 1;
            const findBoard = await boardRepo.save(newBoard);

            res.status(200).send({ 
                success: true, 
                data: findBoard
            });
        } catch (e) {
            res.status(202).send({ 
                success: false,
                message: '잘못된 프로젝트 정보입니다' 
            });
        }
    },

    removeBoard: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const boardId = req.body.boardId;
            const boardRepo = getCustomRepository(BoardRepo);
            const findBoard = await boardRepo.findBoard(boardId);
            if(!findBoard) throw Error;

            const findTask = await boardRepo.findTaskOnly(boardId);
            boardRepo.delete({id: findBoard.id});
            
            res.status(200).send({ 
                success: true, 
                tasks: findTask 
            });
        } catch (e) {
            res.status(202).send({ 
                success: false,
                message: '보드가 존재하지 않습니다'
            });
        }    
    },

    updateBoard: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const boardId = req.body.boardId;
            const boardRepo = getCustomRepository(BoardRepo);
            const findBoard = await boardRepo.findBoard(boardId);
            if(!findBoard) throw new Error('board');

            await boardRepo.createQueryBuilder("board")
                .update(Board)
                .set({title: req.body.boardTitle})
                .where({id: boardId})
                .execute();
            
            res.status(200).send({
                success: true,
                message: '타이틀이 변경 되었습니다'
            });
        } catch (e) {
            e.message === 'board'
            ? res.status(202).send({
                success: false,
                message: '보드가 존재하지 않습니다'
            })
            : res.status(500).send('server error');
        }
    },

    allBoardInfo: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const boardRepo = getCustomRepository(BoardRepo);
            const results = await boardRepo.findAllBoard(req.body.projectId);
            
            const init: object[] = [];
            const tasks = results.reduce((a, c) => {
                a.push(...c.tasks.map(el => el))
                return a;
            }, init);
            
            const columns: object[] = [];
            for (let i=0; i < results.length; i++) {
                const tasks = results[i].tasks.map(el => el.id);
                results[i].tasks = tasks as any
                columns.push(results[i])
            }
            const data = { tasks, columns };

            res.status(200).send({
                success: true,
                data
            });
        } catch (e) {
            res.status(202).send({
                success: false,
                message: '잘못된 요청입니다' 
            });
        }
    },

    shiftBoard: async (req: TypeReq<NumProps>, res: Response) => {
        try {
            const { bIdx, targetIdx } = req.body
            const boardRepo = getRepository(Board);
            const findBoard = await boardRepo.findOne({where: {bIdx: bIdx}});
            if(!findBoard) throw new Error('board');

            const customBoardRepo = getCustomRepository(BoardRepo);
            const results = await customBoardRepo.findAllBoard(findBoard.projectId);
            
            const index = results.findIndex(el => el.bIdx == bIdx);
            results[index].bIdx = 0;
            if(bIdx < targetIdx) results.map(el => {
                if(bIdx < el.bIdx && el.bIdx <= targetIdx) el.bIdx--
            });  
            else results.map(el => {
                if(bIdx > el.bIdx && el.bIdx >= targetIdx) el.bIdx++
            });
            results[index].bIdx = targetIdx;
            await boardRepo.save(results);

            const init: { [key: string]: object[] } = {}
            const tasks = results.reduce((a,c) => {
                a[c.id] = {...c.tasks.map(el => el)};
                return a;
            }, init);

            const columns: { [key: string]: any } = {}
            for (let i=0; i < results.length; i++) {
                const result = results[i];
                columns[result.id] = result;
            }
            const columnOrder = results.map(el => el.id);
            const initialData = { tasks, columns, columnOrder };
            
            res.status(200).send({
                success: true,
                initialData
            });
        } catch (e) {
            e.message === 'board'
            ? res.status(202).send({
                success: false,
                message: '보드가 존재하지 않습니다' 
            })
            : res.status(500).send('server error');
        }
    }
}

export default kanban;

