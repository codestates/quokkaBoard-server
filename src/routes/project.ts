/* Module setting */
import { Router } from 'express';

/* Import endpoint */
import project from '@controllers/project';

/* Endpoint routing */
const projectRouter = Router();
projectRouter.post('/create-project', project.createProject);
projectRouter.post('/remove-project', project.removeProject);
projectRouter.post('/modify-authority', project.modifyAuthority);
projectRouter.post('/dashboard-info', project.dashBoardInfo);

export default projectRouter;