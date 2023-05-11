import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Ownership from "./ownership.model";
import * as fs from "fs";
import { Id, LoadService, serverUtils } from "@shared/util-server";
import { cnst, Utils } from "@shared/util";
import * as db from "../db";
import * as gql from "../gql";
import { srv as external } from "@external/module";
import { ThingService } from "../thing/thing.service";
import { TokenService } from "../token/token.service";

@Injectable()
export class OwnershipService extends LoadService<Ownership.Mdl, Ownership.Doc, Ownership.Input> {
  moneyIds: Id[] = [];
  constructor(
    @InjectModel(Ownership.name)
    private readonly Ownership: Ownership.Mdl,
    private readonly pubsubService: external.PubsubService,
    private readonly thingService: ThingService,
    private readonly tokenService: TokenService
  ) {
    super(OwnershipService.name, Ownership);
  }
  // async onModuleInit() {
  //   const moneyThings = await this.thingService.list({ purpose: "money", status: "active" });
  //   const moneyTokens = await this.tokenService.list({ purpose: "money", status: "active" });
  //   this.moneyIds = [...moneyThings.map((t) => t._id), ...moneyTokens.map((t) => t._id)];
  // }
  async summarize(): Promise<gql.OwnershipSummary> {
    return {
      totalOwnership: await this.Ownership.countDocuments({ status: { $ne: "inactive" } }),
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
    this.pubsubService.publishMany<gql.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async deltaThings(inputs: Ownership.ThingInput[]): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.updateThingValues(inputs);
    this.pubsubService.publishMany<gql.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async reserveThings(inputs: Ownership.ThingInput[]): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.reserveThingValues(inputs);
    this.pubsubService.publishMany<gql.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async releaseThings(inputs: Ownership.ThingInput[]): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.releaseThingValues(inputs);
    this.pubsubService.publishMany<gql.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async creditThings(inputs: Ownership.ThingInput[]): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.creditThingValues(inputs);
    this.pubsubService.publishMany<gql.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async setTokens(inputs: Ownership.TokenInput[]): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.setTokenValues(inputs);
    this.pubsubService.publishMany<gql.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async deltaTokens(inputs: Ownership.TokenInput[]): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.updateTokenValues(inputs);
    this.pubsubService.publishMany<gql.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async reserveTokens(inputs: Ownership.TokenInput[]): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.reserveTokenValues(inputs);
    this.pubsubService.publishMany<gql.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async releaseTokens(inputs: Ownership.TokenInput[]): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.releaseTokenValues(inputs);
    this.pubsubService.publishMany<gql.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async creditTokens(inputs: Ownership.TokenInput[]): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.creditTokenValues(inputs);
    this.pubsubService.publishMany<gql.OwnershipUpdate>("ownershipUpdated", ownerships);
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
  async reduceThing(thing: db.Thing.Doc, user: Id, value: number): Promise<Ownership.Doc> {
    const ownership = await this.Ownership.updateThingValue({ user, value: -value, thing });
    this.pubsubService.publish<gql.OwnershipUpdate>("ownershipUpdated", ownership);
    return ownership;
  }
  async transferThing(thing: db.Thing.Doc, from: Id, to: Id, value: number): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.transferThing(thing, from, to, value);
    this.pubsubService.publishMany<gql.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async transferToken(token: db.Token.Doc, from: Id, to: Id, value: number, bn?: number): Promise<Ownership.Doc[]> {
    const ownerships = await this.Ownership.transferToken(token, from, to, value, bn);
    this.pubsubService.publishMany<gql.OwnershipUpdate>("ownershipUpdated", ownerships);
    return ownerships;
  }
  async getContractPower(contractId: Id, walletId: Id): Promise<{ tokenNum: number; tokens: Id[] }> {
    const ownerships = await this.Ownership.find({ contract: contractId, wallet: walletId, value: { $gt: 0 } });
    return { tokens: ownerships.map((o) => o.token as Id), tokenNum: ownerships.length };
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
  async myOwnership(userId: Id) {
    return await this.Ownership.find({ user: userId, value: { $gt: 0 }, status: "active" });
  }
  async isHolder(walletId: Id, contractId: Id, value = 1) {
    return (await this.Ownership.countDocuments({ wallet: walletId, contract: contractId })) >= value;
  }
}
