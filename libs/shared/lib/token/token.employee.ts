import * as Token from "./token.document";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

import * as cnst from "../cnst";
import * as doc from "../doc";
import { AddrLoadService, DataLoader, Id, createArrayLoader } from "@util/server";
import { FileEmployee } from "../file/file.employee";
@Injectable()
export class TokenEmployee extends AddrLoadService<Token.Mdl, Token.Doc, Token.Input> {
  contractLoader: DataLoader<Id, Token.Doc[], Id>;
  constructor(
    @InjectModel(Token.name)
    private readonly Token: Token.Mdl,
    private readonly fileEmployee: FileEmployee
  ) {
    super(TokenEmployee.name, Token);
    this.contractLoader = createArrayLoader(this.Token as any, "contract");
  }
  async ctrLoad(contractId: Id): Promise<Token.Doc[]> {
    return (await this.contractLoader.load(contractId)) as Token.Doc[];
  }
  async ctrLoadMany(contractIds: Id[]): Promise<Token.Doc[][]> {
    return (await this.contractLoader.loadMany(contractIds)) as Token.Doc[][];
  }
  async generates(contract: doc.Contract.Doc, tokens: { tokenId?: number; uri?: string }[]) {
    const res: Token.Doc[] = [];
    for (const token of tokens) res.push(await this.generate(contract, token.tokenId, token.uri));
    return res;
  }
  async generate(contract: doc.Contract.Doc, tokenId?: number, uri?: string): Promise<Token.Doc> {
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
  async #applyMetadata(token: doc.Token.Doc, uri: string) {
    const meta = await this.fileEmployee.getJsonFromUri(uri);
    if (!meta) return token;
    const image = await this.fileEmployee.addFileFromUri(uri, "token", token._id.toString());
    return await token.merge({ meta, image: image?._id }).save();
  }
  async summarize(): Promise<cnst.TokenSummary> {
    return {
      totalToken: await this.Token.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
