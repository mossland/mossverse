import * as cnst from "../cnst";
import * as doc from "../doc";
import { Id, LogService } from "@util/server";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { emp as platform } from "@platform/server";
import { emp as shared } from "@shared/server";

@Injectable()
export class PointEmployee extends LogService implements OnModuleInit {
  point: doc.shared.Thing.Doc;
  constructor(
    // private readonly stakePoolEmployee: StakePoolEmployee,
    private readonly thingEmployee: shared.ThingEmployee,
    private readonly userEmployee: platform.UserEmployee,
    private readonly ownershipEmployee: shared.OwnershipEmployee,
    private readonly receiptEmployee: platform.ReceiptEmployee
  ) {
    super(PointEmployee.name);
  }

  async onModuleInit() {
    this.point = await this.thingEmployee.generate("point");
  }

  async resetPointsAll() {
    this.logger.verbose("Reset Point Start");
    const num = await this.ownershipEmployee.removeOwnershipsByThing(this.point._id);
    this.logger.verbose(`Point Reset for ${num} users`);
  }

  async getPoint(userId: Id) {
    return (await this.ownershipEmployee.pick({ user: userId, thing: this.point._id })).value;
  }

  async updatePoint(userId: Id, exchange: cnst.platform.Exchange) {
    const outputs = [
      {
        ...exchange,
        user: userId,
        type: "thing" as const,
        thing: this.point._id,
      },
    ];
    const receipt = await this.receiptEmployee.create({
      name: "Update Point",
      type: "admin",
      from: userId,
      inputs: [],
      outputs,
    });
    try {
      await this.ownershipEmployee.deltaThings([{ user: userId, thing: this.point, value: exchange.value }]);
      return receipt.merge({ status: "success" }).save();
    } catch (err) {
      return receipt.merge({ status: "failed", err }).save();
    }
  }
}
