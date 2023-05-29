import * as Advertise from "./advertise.document";
import * as cnst from "../cnst";
import * as doc from "../doc";
import * as emp from "../emp";
import { Id, LoadService } from "@util/server";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
@Injectable()
export class AdvertiseEmployee extends LoadService<Advertise.Mdl, Advertise.Doc, Advertise.Input> {
  private mmoc: doc.shared.Thing.Doc;
  constructor(
    @InjectModel(Advertise.name)
    private readonly Advertise: Advertise.Mdl,
    private readonly userEmployee: emp.platform.UserEmployee,
    private readonly thingEmployee: emp.shared.ThingEmployee,
    private readonly ownershipEmployee: emp.shared.OwnershipEmployee
  ) {
    super(AdvertiseEmployee.name, Advertise);
  }
  async onModuleInit() {
    this.mmoc = await this.thingEmployee.generate("MMOC");
  }

  async bid(advertiseId: Id, userId: Id, value: number, images?: Id[], video?: Id): Promise<Advertise.Doc> {
    const advertise = await this.get(advertiseId);
    const user = await this.userEmployee.get(userId);
    const mmoc = await this.ownershipEmployee.pick({
      user: user._id,
      thing: this.mmoc._id,
    });
    if (mmoc.value < value) throw new Error("Not enough MMOC");
    return await advertise.addBid(user._id, value, images, video).save();
  }

  async summarize(): Promise<cnst.AdvertiseSummary> {
    return {
      totalAdvertise: await this.Advertise.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
