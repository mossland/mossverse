import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Erc20, Id, LoadConfig, LoadService } from "@shared/util-server";
import * as Advertise from "./advertise.model";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
@Injectable()
export class AdvertiseService extends LoadService<Advertise.Mdl, Advertise.Doc, Advertise.Input> {
  private mmoc: db.shared.Thing.Doc;
  constructor(
    @InjectModel(Advertise.name)
    private readonly Advertise: Advertise.Mdl,
    private readonly userService: srv.platform.UserService,
    private readonly thingService: srv.shared.ThingService,
    private readonly ownershipService: srv.shared.OwnershipService
  ) {
    super(AdvertiseService.name, Advertise);
  }
  async onModuleInit() {
    this.mmoc = await this.thingService.generate("MMOC");
  }

  async bid(advertiseId: Id, userId: Id, value: number, images?: Id[], video?: Id): Promise<Advertise.Doc> {
    const advertise = await this.get(advertiseId);
    const user = await this.userService.get(userId);
    const mmoc = await this.ownershipService.pick({ user: user._id, thing: this.mmoc._id });
    if (mmoc.value < value) throw new Error("Not enough MMOC");
    return await advertise.addBid(user._id, value, images, video).save();
  }

  async summarize(): Promise<gql.AdvertiseSummary> {
    return {
      totalAdvertise: await this.Advertise.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
