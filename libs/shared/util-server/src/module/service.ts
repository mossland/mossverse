import { Logger } from "@nestjs/common";
import { Id, DataLoader, createLoader, Query, DefaultMdlStats, DefaultDocMtds } from "../dbConfig";
import { Model, Document } from "mongoose";
import { Account } from "../middlewares";

export interface LoadConfig<Doc = any> {
  account?: Account | null;
  address?: string;
  ip?: string;
  tail?: Partial<Doc>;
}

export class LogService {
  readonly logger: Logger;
  constructor(name: string) {
    this.logger = new Logger(name);
  }
}
export class LoadService<
  Mdl extends Model<any> & DefaultMdlStats<any, any>,
  Doc extends Document<any> & DefaultDocMtds<any>,
  Input
> extends LogService {
  loader: DataLoader<Id, Doc>;
  model: Mdl;
  constructor(private name: string, model: Mdl) {
    super(name);
    this.loader = createLoader<Id, Doc>(model);
    this.model = model;
  }
  async load(id?: Id) {
    return (id && (await this.loader.load(id))) as Doc | null;
  }
  async loadMany(ids: Id[]) {
    return (await this.loader.loadMany(ids)) as Doc[];
  }
  async get(id: Id): Promise<Doc> {
    const doc = await this.load(id);
    if (!doc) throw new Error(`No Document (${this.name}): ${id}`);
    return doc;
  }
  async list(query: Query<Doc>, skip = 0, limit = 0, sort: any = {}): Promise<Doc[]> {
    return await this.model
      .find({ status: { $ne: "inactive" }, ...query })
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }
  async pick(query: Query<Doc>): Promise<Doc> {
    const doc = await this.model.findOne(query);
    if (!doc) throw new Error(`No Document (${this.name}): ${query}`);
    return doc;
  }
  async exists(query: Query<Doc>): Promise<boolean> {
    return await (this.model as any).exists(query);
  }
  async count(query: Query<Doc>): Promise<number> {
    return await this.model.countDocuments({ status: { $ne: "inactive" }, ...query });
  }
  async create(data: Input, config?: LoadConfig<Doc>): Promise<Doc> {
    const doc = await new this.model(data).save();
    if (config?.tail) await doc.merge(config.tail).save();
    return doc;
  }
  async update(id: Id, data: Partial<Doc>, config?: LoadConfig<Doc>): Promise<Doc> {
    const doc = await this.get(id);
    if (!doc) throw new Error(`No Document (${this.name}): ${id}`);
    Object.assign(doc, data, config?.tail ?? {});
    return await doc.save();
  }
  async remove(id: Id, config: LoadConfig<Doc> = {}): Promise<Doc> {
    const doc = await this.get(id);
    if (!doc) throw new Error(`No Document (${this.name}): ${id}`);
    Object.assign(doc, { status: "inactive" }, config?.tail ?? {});
    await doc.save();
    return doc;
  }
}
export class AddrLoadService<
  Mdl extends Model<any> & DefaultMdlStats<any, any>,
  Doc extends Document<any> & DefaultDocMtds<any>,
  Input
> extends LoadService<Mdl, Doc, Input> {
  addrLoader: DataLoader<string, Doc, string>;
  constructor(name: string, model: Mdl) {
    super(name, model);
    this.addrLoader = createLoader(model, "address");
  }
  async loadAddr(address?: string) {
    return (address && (await this.addrLoader.load(address))) as Doc | null;
  }
  async loadAddrMany(addresses: string[]) {
    return (await this.addrLoader.loadMany(addresses)) as Doc[];
  }
}
