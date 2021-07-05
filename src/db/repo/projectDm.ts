import { EntityRepository, Repository, JoinTable, JoinColumn } from 'typeorm';
import { UserProject } from '@entity/UserProject';


@EntityRepository(UserProject)
export class UserProjectRepo extends Repository <UserProject> {

    // joinUser(id: number, userId: string, projectId: string) {
    //     return this.createQueryBuilder()
    //     .relation("user", "project")
    //     .of(id)
    //     .set(userId, projectId)
    // }
    
    joinProject(id: number, projectId: string) {
        return this.createQueryBuilder()
        .relation(UserProject, "project")
        .of(id)
        .set(projectId)
    }

}
