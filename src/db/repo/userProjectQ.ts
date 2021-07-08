import { EntityRepository, Repository } from 'typeorm';
import { UserProject } from '@entity/UserProject';


@EntityRepository(UserProject)
export class UserProjectRepo extends Repository <UserProject> {

    findAuthProject(userId: string, projectId: string) {
        return this.createQueryBuilder("user_project")
        .where({userId: userId, projectId: projectId})
        .getOne();
    }

    changeUserAuth(id: number, authority: string) {
        return this.createQueryBuilder("user_project")
        .update(UserProject)
        .set({ authority: authority })
        .where({id: id})
        .execute();
    }

    addProjectMember(userData: object) {
        return this.createQueryBuilder("user_project")
        .insert()
        .into(UserProject)
        .values(userData)
        .execute();
    }
   
}