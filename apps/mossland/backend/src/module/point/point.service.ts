import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Id, LoadService, LogService } from "@shared/util-server";
import * as gql from "../gql";
import * as db from "../db";
import { srv as shared } from "@shared/module";
import { srv as platform } from "@platform/module";
import { StakePoolService } from "../srv";

@Injectable()
export class PointService extends LogService implements OnModuleInit {
  point: db.shared.Thing.Doc;
  constructor(
    // private readonly stakePoolService: StakePoolService,
    private readonly thingService: shared.ThingService,
    private readonly userService: platform.UserService,
    private readonly ownershipService: shared.OwnershipService,
    private readonly receiptService: platform.ReceiptService
  ) {
    super(PointService.name);
  }

  async onModuleInit() {
    this.point = await this.thingService.generate("point");
  }

  async resetPointsAll() {
    this.logger.verbose("Reset Point Start");
    const num = await this.ownershipService.removeOwnershipsByThing(this.point._id);
    this.logger.verbose(`Point Reset for ${num} users`);
  }

  async getPoint(userId: Id) {
    return (await this.ownershipService.pick({ user: userId, thing: this.point._id })).value;
  }

  async updatePoint(userId: Id, exchange: gql.platform.Exchange) {
    const outputs = [{ ...exchange, user: userId, type: "thing" as const, thing: this.point._id }];
    const receipt = await this.receiptService.create({
      name: "Update Point",
      type: "admin",
      from: userId,
      inputs: [],
      outputs,
    });
    try {
      await this.ownershipService.deltaThings([{ user: userId, thing: this.point, value: exchange.value }]);
      return receipt.merge({ status: "success" }).save();
    } catch (err) {
      return receipt.merge({ status: "failed", err }).save();
    }
  }
}
