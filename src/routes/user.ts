/* Module setting */
import { Router } from 'express';

/* Import endpoint */
import user from '@controllers/user'

/* Endpoint routing */
const userRouter = Router();
userRouter.post('/register', user.register);
userRouter.post('/login', user.login);
userRouter.post('/logout', user.logout);
userRouter.post('/social-login', user.socialLogin);
userRouter.post('/social-info', user.socialInfo);
userRouter.post('/exist-email', user.existEmail);
userRouter.post('/exist-nickname', user.existNickName);
userRouter.post('/user-info', user.userInfo);

export default userRouter;