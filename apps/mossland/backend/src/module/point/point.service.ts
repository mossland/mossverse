import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Id, LoadService, LogService } from "@shared/util-server";
import * as gql from "../gql";
import * as db from "../db";
import * as srv from "../srv";

@Injectable()
export class PointService extends LogService implements OnModuleInit {
  point: db.shared.Thing.Doc;
  constructor(
    private readonly thingService: srv.shared.ThingService,
    private readonly userService: srv.UserService,
    private readonly receiptService: srv.platform.ReceiptService
  ) {
    super(PointService.name);
  }
  async onModuleInit() {
    this.point = await this.thingService.generate("Point");
  }
  async resetPointsAll() {
    this.logger.verbose("Reset Point Start");
    const num = await this.userService.resetItemsAll(this.point._id);
    this.logger.verbose(`Point Reset for ${num} users`);
  }
  async getPoint(userId: Id) {
    const user = await this.userService.get(userId);
    return user.item(this.point._id).num;
  }
  async updatePoint(userId: Id, exchange: gql.platform.Exchange) {
    const user = await this.userService.get(userId);
    const outputs = [{ ...exchange, thing: this.point._id }];
    await user.incItems(outputs).save();
    return await this.receiptService.create({
      name: "Update Point",
      type: "admin",
      from: user._id,
      inputs: [],
      outputs,
    });
  }
}
