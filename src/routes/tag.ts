/* Module setting */
import express from 'express';

/* Import endpoint */
import tag from '@controllers/tag';

/* Endpoint routing */
const tagRouter = express.Router();
tagRouter.post('/create-tag', tag.createTag);
tagRouter.put('/update-tag', tag.updateTag);
tagRouter.get('/read-tag', tag.readTag);
tagRouter.delete('/delete-tag', tag.deleteTag);

export default tagRouter;