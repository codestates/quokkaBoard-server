import express from 'express'
import project from '@controllers/project'

const projectRouter = express.Router();
projectRouter.post('/create-project', project.createProject);
projectRouter.delete('/remove-project', project.removeProject);
projectRouter.patch('/modify-authority', project.modifyAuthority);
projectRouter.put('/modify-project', project.modifyProject);
projectRouter.post('/invite-member', project.inviteMember);
projectRouter.post('/dashboard-info', project.dashBoardInfo);
projectRouter.post('/project-members', project.projectMembers);
projectRouter.post('/project-list', project.projectList);
projectRouter.delete('/remove-member', project.removeMember);

export default projectRouter;