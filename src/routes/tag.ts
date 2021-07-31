import express from 'express'
import tag from '../controllers/tag'

const tagRouter = express.Router();
tagRouter.post('/create-tag', tag.createTag);
tagRouter.put('/update-tag', tag.updateTag);
tagRouter.post('/read-tag', tag.readTag);
tagRouter.delete('/delete-tag', tag.deleteTag);

export default tagRouter;