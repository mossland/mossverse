import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Token from "./token.model";

import { AddrLoadService, createArrayLoader, DataLoader, Id, serverUtils } from "@shared/util-server";
import { Utils } from "@shared/util";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { FileService } from "../file/file.service";
import axios from "axios";
@Injectable()
export class TokenService extends AddrLoadService<Token.Mdl, Token.Doc, Token.Input> {
  contractLoader: DataLoader<Id, Token.Doc[]>;
  constructor(
    @InjectModel(Token.name)
    private readonly Token: Token.Mdl,
    private readonly fileService: FileService
  ) {
    super(TokenService.name, Token);
    this.contractLoader = createArrayLoader(this.Token as any, "contract");
  }
  async ctrLoad(contractId: Id): Promise<Token.Doc[]> {
    return (await this.contractLoader.load(contractId)) as Token.Doc[];
  }
  async ctrLoadMany(contractIds: Id[]): Promise<Token.Doc[][]> {
    return (await this.contractLoader.loadMany(contractIds)) as Token.Doc[][];
  }
  async generates(contract: db.Contract.Doc, tokens: { tokenId?: number; uri?: string }[]) {
    const res: Token.Doc[] = [];
    for (const token of tokens) res.push(await this.generate(contract, token.tokenId, token.uri));
    return res;
  }
  async generate(contract: db.Contract.Doc, tokenId?: number, uri?: string) {
    const token =
      (await this.Token.findOne({ contract: contract._id, tokenId })) ??
      (await this.create({ contract: contract._id, tokenId }));
    if (uri && (token.isNew || token.uri !== uri)) await this.#applyMetadata(token, uri);
    return token;
  }
  async activateTokens(contractId: Id) {
    const { modifiedCount } = await this.Token.updateMany(
      { contract: contractId, status: "inactive" },
      { $set: { status: "active" } }
    );
    return modifiedCount;
  }
  async deactivateTokens(contractId: Id) {
    const { modifiedCount } = await this.Token.updateMany(
      { contract: contractId, status: "active" },
      { $set: { status: "inactive" } }
    );
    return modifiedCount;
  }
  async #applyMetadata(token: db.Token.Doc, uri: string) {
    const meta = await this.fileService.getJsonFromUri(uri);
    if (!meta) return token;
    const image = await this.fileService.addFileFromUri(uri, "token", token._id.toString());
    return await token.merge({ meta, image: image?._id }).save();
  }
}
// async akamirsByAttributes(attributes: gql.AkamirAttributeInput[], offset: number, limit: number) {
//   if (!attributes.length) {
//     return await this.Akamir.find({ status: { $ne: "inactive" }, isRevealed: true })
//       .skip(offset)
//       .limit(limit);
//   }
//   return await this.Akamir.find({
//     status: { $ne: "inactive" },
//     isRevealed: true,
//     $and: attributes.map((cur: gql.AkamirAttributeInput) => ({
//       "revealed.meta.attributes": { $elemMatch: { trait_type: cur.trait_type, value: { $in: cur.values } } },
//     })),
//   })
//     .skip(offset)
//     .limit(limit);
// }
// async akamirCountByAttributes(attributes: gql.AkamirAttributeInput[]) {
//   if (!attributes.length) return await this.count({});
//   return await this.Akamir.find({
//     status: { $ne: "inactive" },
//     isRevealed: true,
//     $and: attributes.map((cur: gql.AkamirAttributeInput) => ({
//       "revealed.meta.attributes": { $elemMatch: { trait_type: cur.trait_type, value: { $in: cur.values } } },
//     })),
//   }).count();
// }
