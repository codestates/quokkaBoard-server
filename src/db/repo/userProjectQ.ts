import { EntityRepository, Repository } from 'typeorm';
import { Project } from '../entity/Project';
import { UserProject } from '../entity/UserProject';
import { StrProps } from '../../types';

@EntityRepository(Project)
export class ProjectRepo extends Repository <Project> {
    
    findProject(id: string) {
        return this
        .createQueryBuilder("project")
        .where({id: id})
        .getOne();
    }

}

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

    findUserInProject(data: StrProps) {
        return this
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

    findAllProjectUser(projectId: string) {
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
        .where({projectId: projectId})
        .getRawMany();
    }
   
}