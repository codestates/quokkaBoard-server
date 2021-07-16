/* Module setting */
import express from 'express';

/* Import endpoint */
import project from '@controllers/project';

/* Endpoint routing */
const projectRouter = express.Router();
projectRouter.post('/create-project', project.createProject);
projectRouter.delete('/remove-project', project.removeProject);
projectRouter.patch('/modify-authority', project.modifyAuthority);
projectRouter.put('/modify-project', project.modifyProject);
projectRouter.post('/invite-member', project.inviteMember);
projectRouter.post('/dashboard-info', project.dashBoardInfo);
projectRouter.post('/project-members', project.projectMembers);

export default projectRouter;