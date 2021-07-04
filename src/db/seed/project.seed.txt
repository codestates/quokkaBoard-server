import { Factory, Seeder } from "typeorm-seeding"
import { Connection } from "typeorm"
import { Project } from "../entity/Project"

export default class CreateUsers implements Seeder {
  public async run(factory:Factory, connection: Connection):Promise<any> {
    await factory(Project)().createMany(10)
  }
}   
