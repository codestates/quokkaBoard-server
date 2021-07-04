import { factory, define } from "typeorm-seeding"
import { Project } from "../entity/Project"
import Faker from "faker"

define(Project, (faker: typeof Faker) => {
  
    const project = new Project()
    project.title = faker.name.jobType()
    project.created_at = faker.date.past()
    project.updated_at = faker.date.recent()
    project.start_date = faker.date.past()
    project.end_date = faker.date.recent()
    
    return project;
  })