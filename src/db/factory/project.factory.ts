import { factory, define } from "typeorm-seeding"
import { Project } from "../entity/Project"
import Faker from "faker"

define(Project, (faker: typeof Faker) => {
  
    const project = new Project()
    project.title = faker.name.jobType()
    // project.start_date = faker.date.past()
    // project.end_date = faker.date.recent()
    
    return project;
})