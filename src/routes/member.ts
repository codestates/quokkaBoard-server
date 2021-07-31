import express from 'express'
import member from '../controllers/member'

const memberRouter = express.Router();
memberRouter.post('/search-follower', member.searchFollower);
memberRouter.post('/add-follower', member.addFollower);
memberRouter.delete('/delete-follower', member.deleteFollower);
memberRouter.post('/get-follower', member.getFollower);

export default memberRouter;