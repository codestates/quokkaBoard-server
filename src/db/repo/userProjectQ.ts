import { EntityRepository, Repository } from 'typeorm';
import { UserProject } from '@entity/UserProject';
import { StrProps } from '@types';


@EntityRepository(UserProject)
export class UserProjectRepo extends Repository <UserProject> {

    findAuthProject(data: StrProps) {
        return this
        .createQueryBuilder("user_project")
        .where({userId: data.userId, projectId: data.projectId})
        .getOne();
    }

    findUserProjectId(userId: string | string[], projectId: string) {
        return this
        .createQueryBuilder("user_project")
        .select(["user_project.id"])
        .where("userId IN (:userId)", {
            userId: userId
        })
        .andWhere("projectId = :projectId", {
            projectId: projectId
        })
        .getMany();
    }

    async findUserInProject(data: StrProps) {
        return await this
        .createQueryBuilder("user_project")
        .innerJoin("user_project.user", "user")
        .select([
            "user_project.id AS id",
            "user.id AS userId" ,
            "user.nickname AS nickname",
            "user.email AS email",
            "user.image AS image",
            "user_project.authority AS authority",
            "user_project.projectId AS projectId"
        ])
        .where({
            userId: data.userId,
            projectId: data.projectId
        })
        .getRawOne();
    }

    findProjectList(data: StrProps) {
        return this
        .createQueryBuilder('user_project')
        .innerJoin("user_project.project", "project")
        .select([
            "authority",
            "userId",
            "projectId",
            "project.title AS title",
            "project.description AS description"
        ])
        .where({userId: data.userId})
        .getRawMany();
    }

    findAllProjectUser(data: StrProps) {
        return this
        .createQueryBuilder("user_project")
        .innerJoin("user_project.user", "user")
        .select([
            "user.id AS id" ,
            "user.nickname AS nickname",
            "user.email AS email",
            "user.image AS image",
            "user_project.authority AS authority",
            "user_project.projectId AS projectId"
        ])
        .where({projectId: data.projectId})
        .getRawMany();
    }

    changeUserAuth(data: StrProps) {
        return this
        .createQueryBuilder("user_project")
        .update(UserProject)
        .set({authority: data.authority})
        .where({
            userId: data.userId, 
            projectId: data.projectId
        })
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