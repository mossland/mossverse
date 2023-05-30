import * as StakePool from "./stakePool.document";
import * as cnst from "../cnst";
import * as doc from "../doc";
import * as emp from "../emp";
import { Id, LoadService } from "@util/server";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StakePoolEmployee extends LoadService<StakePool.Mdl, StakePool.Doc, StakePool.Input> {
  private mmoc: doc.shared.Thing.Doc;
  private point: doc.shared.Thing.Doc;
  constructor(
    @InjectModel(StakePool.name)
    private readonly StakePool: StakePool.Mdl,
    private readonly userEmployee: emp.platform.UserEmployee,
    private readonly thingEmployee: emp.shared.ThingEmployee,
    private readonly ownershipEmployee: emp.shared.OwnershipEmployee
  ) {
    super(StakePoolEmployee.name, StakePool);
  }
  async onModuleInit() {
    this.mmoc = await this.thingEmployee.generate("MMOC");
    this.point = await this.thingEmployee.generate("point");
  }

  async addStaking(stakePoolId: Id, staking: cnst.StakingInput): Promise<doc.StakePool.Doc> {
    const stakePool = await this.get(stakePoolId);
    const user = await this.userEmployee.get(staking.user);
    const hasThing = await this.ownershipEmployee.hasThing(user._id, this.mmoc._id, staking.value);
    if (!hasThing) throw new Error("Not enouth MMOC.");
    //* transfer address
    const outputs = [
      {
        type: "thing" as const,
        user: user._id,
        thing: this.mmoc._id,
        value: staking.value,
      },
    ];
    await this.ownershipEmployee.deltaThings(
      outputs.map((output) => ({ ...output, thing: this.mmoc, value: -output.value }))
    );

    return await stakePool.addStaking(user._id, staking.value, staking.wallet, staking.expireAt).save();
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
          const user = await this.userEmployee.get(staking.user);
          if (!staking.expireAt) return;
          const reward = Math.floor(
            (((staking.expireAt.getTime() - staking.stakingAt.getTime()) / 1000) * 60 * 60 + staking.value) * 100
          );
          const ownership = await this.ownershipEmployee.pick({
            user: user._id,
            thing: this.mmoc._id,
          });
          ownership.add(reward);
        })
    );
  }

  async deposit(stakePoolId: Id, reqUser: Id, wallet: Id, value: number): Promise<void> {
    const stakePool = await this.get(stakePoolId);
    if (stakePool.type !== "exchange") throw new Error("Not exchange type");
    const user = await this.userEmployee.get(reqUser);
    const point = await this.ownershipEmployee.pick({
      user: user._id,
      thing: this.point._id,
    });
    if (point.value < value) throw new Error("Not enough point");
    await point.sub(value).save();
    await stakePool.addStaking(user._id, value, wallet).save();
  }

  async exchange(stakePoolId: Id, reqUser: Id, value: number): Promise<void> {
    const stakePool = await this.get(stakePoolId);
    if (stakePool.type !== "exchange") throw new Error("Not exchange type");
    const user = await this.userEmployee.get(reqUser);
    const point = await this.ownershipEmployee.pick({
      user: user._id,
      thing: this.point._id,
    });
    if (point.value < value) throw new Error("Not enough point");
    if (stakePool.stakings[0].value - value <= 0) stakePool.stakings.shift();
    else stakePool.stakings[0].value -= value;
    await stakePool.save();
    await point.add(value).save();
  }

  async summarize(): Promise<cnst.StakePoolSummary> {
    return {
      totalStakePool: await this.StakePool.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
