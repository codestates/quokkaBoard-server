import { factory, define } from "typeorm-seeding"
import { Project } from "../entity/Project"
import Faker from "faker"

define(Project, (faker: typeof Faker) => {
    const project = new Project()
    project.title = faker.name.title()
    
    return project;
})