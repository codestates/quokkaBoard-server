import { EntityRepository, Repository } from 'typeorm';
import { Project } from '@entity/Project';


@EntityRepository(Project)
export class ProjectRepo extends Repository <Project> {

    findUsers(projectId: string) {
        return this.createQueryBuilder("project")
        .leftJoinAndSelect("project.user_project", "users")
        .where({id: projectId})
        .getRawMany();
    }

}
