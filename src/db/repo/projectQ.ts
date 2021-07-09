import { EntityRepository, Repository } from 'typeorm';
import { Project } from '@entity/Project';
import { StrProps } from '@types';


@EntityRepository(Project)
export class ProjectRepo extends Repository <Project> {
    
    findProject(id: string) {
        return this.createQueryBuilder("project")
        .where("project.id = :id", { id })
        .getOne();
    }

    editProject(id: string, data: StrProps) {
        return this.createQueryBuilder("project")
        .update(Project)
        .set({
            title: data.title,
            description: data.description,
            start_date: data.startDate, 
            end_date: data.endDate
        })
        .where("project.id = :id", { id })
        .execute();
    }

}
