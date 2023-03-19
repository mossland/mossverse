import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as StakePool from "./stakePool.model";
import * as fs from "fs";
import { LoadConfig, Id, LoadService } from "@shared/util-server";
import { Utils } from "@shared/util";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { Types } from "mongoose";

@Injectable()
export class StakePoolService extends LoadService<StakePool.Mdl, StakePool.Doc, StakePool.Input> {
  private mmoc: db.shared.Thing.Doc;
  private point: db.shared.Thing.Doc;
  constructor(
    @InjectModel(StakePool.name)
    private readonly StakePool: StakePool.Mdl,
    private readonly userService: srv.platform.UserService,
    private readonly thingService: srv.shared.ThingService,
    private readonly ownershipService: srv.shared.OwnershipService
  ) {
    super(StakePoolService.name, StakePool);
  }
  async onModuleInit() {
    this.mmoc = await this.thingService.generate("MMOC");
    this.point = await this.thingService.generate("point");
  }

  async staking(stakePoolId: Id, userId: Id, value: number, expireAt: Date): Promise<db.StakePool.Doc> {
    const stakePool = await this.get(stakePoolId);
    const user = await this.userService.get(userId);
    const mmoc = await this.ownershipService.pick({ user: user._id, thing: this.mmoc._id });
    if (mmoc.value < value) throw new Error("Not enough MMOC");
    return await stakePool.addStaking(user._id, value, expireAt).save();
  }

  /**
   *
   * 게임 건물에 staking된 전체 MMOC 갯수
   *다음 정산까지 남은 시간 (hr)
   *저번 정산부터 다음 정산까지의 staking history
   *Owner, duration, amount, reward ratio로 구성
   * Reward ratio는 각 staking의 amount / sum(duration*amount) * 100
   */
  async reward(stakePoolId: Id): Promise<void> {
    const stakePool = await this.get(stakePoolId);
    if (stakePool.type !== "staking") throw new Error("Not staking type");
    await Promise.all(
      stakePool.stakings
        .filter((staking) => staking.expireAt && staking.expireAt < new Date())
        .map(async (staking) => {
          const user = await this.userService.get(staking.user);
          if (!staking.expireAt) return;
          const reward = Math.floor(
            (((staking.expireAt.getTime() - staking.stakingAt.getTime()) / 1000) * 60 * 60 + staking.value) * 100
          );
          const ownership = await this.ownershipService.pick({ user: user._id, thing: this.mmoc._id });
          ownership.add(reward);
        })
    );
  }

  async deposit(stakePoolId: Id, reqUser: Id, value: number): Promise<void> {
    const stakePool = await this.get(stakePoolId);
    if (stakePool.type !== "exchange") throw new Error("Not exchange type");
    const user = await this.userService.get(reqUser);
    const point = await this.ownershipService.pick({ user: user._id, thing: this.point._id });
    if (point.value < value) throw new Error("Not enough point");
    await point.sub(value).save();
    await stakePool.addStaking(user._id, value).save();
  }

  async exchange(stakePoolId: Id, reqUser: Id, value: number): Promise<void> {
    const stakePool = await this.get(stakePoolId);
    if (stakePool.type !== "exchange") throw new Error("Not exchange type");
    const user = await this.userService.get(reqUser);
    const point = await this.ownershipService.pick({ user: user._id, thing: this.point._id });
    if (point.value < value) throw new Error("Not enough point");
    if (stakePool.stakings[0].value - value <= 0) stakePool.stakings.shift();
    else stakePool.stakings[0].value -= value;
    await stakePool.save();
    await point.add(value).save();
  }

  async summarize(): Promise<gql.StakePoolSummary> {
    return {
      totalStakePool: await this.StakePool.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
