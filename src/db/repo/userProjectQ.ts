import { EntityRepository, Repository } from 'typeorm';
import { UserProject } from '@entity/UserProject';
import { StrArrProps, StrProps } from '@types';


@EntityRepository(UserProject)
export class UserProjectRepo extends Repository <UserProject> {

    findAuthProject(data: StrProps) {
        return this
        .createQueryBuilder("user_project")
        .where({userId: data.userId, projectId: data.projectId})
        .getOne();
    }

    findUserProjectId(userId: string | string[]) {
        return this
        .createQueryBuilder("user_project")
        .select(["user_project.id"])
        .where("userId IN (:userId)", {
            userId: userId
        })
        .getMany();
    }

    changeUserAuth(id: number, authority: string) {
        return this
        .createQueryBuilder("user_project")
        .update(UserProject)
        .set({authority: authority})
        .where({id: id})
        .execute();
    }

    addProjectMember(userData: object) {
        return this
        .createQueryBuilder("user_project")
        .insert()
        .into(UserProject)
        .values(userData)
        .execute();
    }
   
}