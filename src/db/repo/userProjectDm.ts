import { EntityRepository, Repository } from 'typeorm';
import { UserProject } from '@entity/UserProject';


@EntityRepository(UserProject)
export class UserProjectRepo extends Repository <UserProject> {

    findProjects(userId: string) {
        return this.createQueryBuilder("user_project")
        .leftJoinAndSelect("user_project.project", "projects")
        .where({userId: userId})
        .getRawMany();
    }

    findAuthProject(userId: string, projectId: string) {
        return this.createQueryBuilder("user_project")
        .where({userId: userId, projectId: projectId})
        .getOneOrFail();
    }

}