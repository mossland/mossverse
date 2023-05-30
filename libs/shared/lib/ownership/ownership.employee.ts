import * as Ownership from "./ownership.document";
import * as cnst from "../cnst";
import * as doc from "../doc";
import { Id, LoadService } from "@util/server";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { ThingEmployee } from "../thing/thing.employee";
import { TokenEmployee } from "../token/token.employee";
import { emp as external } from "@external/server";

@Injectable()
export class OwnershipEmployee extends LoadService<Ownership.Mdl, Ownership.Doc, Ownership.Input> {
  moneyIds: Id[] = [];
  constructor(
    @InjectModel(Ownership.name)
    private readonly Ownership: Ownership.Mdl,
    private readonly pubsubEmployee: external.PubsubEmployee,
    private readonly thingEmployee: ThingEmployee,
    private readonly tokenEmployee: TokenEmployee
  ) {
    super(OwnershipEmployee.name, Ownership);
  }
  // async onModuleInit() {
  //   const moneyThings = await this.thingEmployee.list({ purpose: "money", status: "active" });
  //   const moneyTokens = await this.tokenEmployee.list({ purpose: "money", status: "active" });
  //   this.moneyIds = [...moneyThings.map((t) => t._id), ...moneyTokens.map((t) => t._id)];
  // }
  async summarize(): Promise<cnst.OwnershipSummary> {
    return {
      totalOwnership: await this.Ownership.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
  async setOwnershipsByContract(contractId: Id, inputs: Ownership.TokenInput[]): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.setTokenValues(inputs);
    await this.Ownership.resetByContract(
      contractId,
      ownerships.map((o) => o._id)
    );
    return ownerships;
  }
  async setThings(inputs: Ownership.ThingInput[]): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.setThingValues(inputs);
    this.pubsubEmployee.publishMany<cnst.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async deltaThings(inputs: Ownership.ThingInput[]): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.updateThingValues(inputs);
    this.pubsubEmployee.publishMany<cnst.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async reserveThings(inputs: Ownership.ThingInput[]): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.reserveThingValues(inputs);
    this.pubsubEmployee.publishMany<cnst.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async releaseThings(inputs: Ownership.ThingInput[]): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.releaseThingValues(inputs);
    this.pubsubEmployee.publishMany<cnst.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async creditThings(inputs: Ownership.ThingInput[]): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.creditThingValues(inputs);
    this.pubsubEmployee.publishMany<cnst.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async setTokens(inputs: Ownership.TokenInput[]): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.setTokenValues(inputs);
    this.pubsubEmployee.publishMany<cnst.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async deltaTokens(inputs: Ownership.TokenInput[]): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.updateTokenValues(inputs);
    this.pubsubEmployee.publishMany<cnst.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async reserveTokens(inputs: Ownership.TokenInput[]): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.reserveTokenValues(inputs);
    this.pubsubEmployee.publishMany<cnst.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async releaseTokens(inputs: Ownership.TokenInput[]): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.releaseTokenValues(inputs);
    this.pubsubEmployee.publishMany<cnst.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async creditTokens(inputs: Ownership.TokenInput[]): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.creditTokenValues(inputs);
    this.pubsubEmployee.publishMany<cnst.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async removeOwnershipsByUser(userId: Id): Promise<boolean> {
    return await this.Ownership.removeByUser(userId);
  }
  async removeOwnershipsByContract(contractId: Id): Promise<boolean> {
    return await this.Ownership.resetByContract(contractId);
  }
  async removeOwnershipsByThing(thingId: Id): Promise<boolean> {
    return await this.Ownership.resetByThing(thingId);
  }
  async transferWalletOwnerships(walletId: Id, userId: Id | null): Promise<boolean> {
    return await this.Ownership.transferByWallet(walletId, userId);
  }
  async reduceThing(thing: doc.Thing.Doc, user: Id, value: number): Promise<Ownership.Doc> {
    const ownership = await this.Ownership.updateThingValue({
      user,
      value: -value,
      thing,
    });
    this.pubsubEmployee.publish<cnst.OwnershipUpdate>("ownershipUpdated", ownership);
    return ownership;
  }
  async transferThing(thing: doc.Thing.Doc, from: Id, to: Id, value: number): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.transferThing(thing, from, to, value);
    this.pubsubEmployee.publishMany<cnst.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async transferToken(token: doc.Token.Doc, from: Id, to: Id, value: number, bn?: number): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.transferToken(token, from, to, value, bn);
    this.pubsubEmployee.publishMany<cnst.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async getContractPower(contractId: Id, walletId: Id): Promise<{ tokenNum: number; tokens: Id[] }> {
    const ownerships = await this.Ownership.find({
      contract: contractId,
      wallet: walletId,
      value: { $gt: 0 },
    });
    return {
      tokens: ownerships.map((o) => o.token as Id),
      tokenNum: ownerships.length,
    };
  }
  async hasThing(userId: Id, thingId: Id, value?: number) {
    return !!(await this.Ownership.exists({
      user: userId,
      thing: thingId,
      value: value ? { $gte: value } : { $gt: 0 },
      status: "active",
    }));
  }
  async hasToken(walletId: Id, tokenId: Id, value?: number) {
    return await this.Ownership.exists({
      wallet: walletId,
      token: tokenId,
      value: value ? { $gte: value } : { $gt: 0 },
      status: "active",
    });
  }
  async myOwnerships(userId: Id) {
    return await this.Ownership.find({ user: userId, value: { $gt: 0 }, status: "active" });
  }
  async myOwnership(type: "thing" | "token", userId: Id, itemId: Id) {
    return await this.Ownership.findOne({ user: userId, [type]: itemId, status: "active" });
  }

  async isHolder(walletId: Id, contractId: Id, value = 1) {
    return (
      (await this.Ownership.countDocuments({
        wallet: walletId,
        contract: contractId,
      })) >= value
    );
  }
}
