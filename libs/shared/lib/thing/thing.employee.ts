import * as Thing from "./thing.document";
import * as cnst from "../cnst";
import { DataLoader, Id, LoadService, createLoader } from "@util/server";
import { FileEmployee } from "../file/file.employee";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ThingEmployee extends LoadService<Thing.Mdl, Thing.Doc, Thing.Input> {
  rootLoader: DataLoader<Id, Thing.Doc | null, Id>;
  constructor(
    @InjectModel(Thing.name)
    private readonly Thing: Thing.Mdl,
    private readonly fileEmployee: FileEmployee
  ) {
    super(ThingEmployee.name, Thing);
    this.rootLoader = createLoader(Thing, "root");
  }

  async rootLoad(rootId?: Id): Promise<Thing.Doc | null> {
    return (rootId && (await this.rootLoader.load(rootId))) as Thing.Doc | null;
  }
  async generate(name: string, data: Partial<Thing.Doc> = {}): Promise<Thing.Doc> {
    return (
      (await this.Thing.findOne({ name })) ??
      (
        await new this.Thing({
          ...data,
          name,
          description: name,
          image: (await this.fileEmployee.generate())._id,
        })
      ).save()
    );
  }
  async summarize(): Promise<cnst.ThingSummary> {
    return {
      totalThing: await this.Thing.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
