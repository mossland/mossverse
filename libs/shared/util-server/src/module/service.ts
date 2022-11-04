import { Logger } from "@nestjs/common";
import { Id, DataLoader, createLoader, Query } from "../dbConfig";
import { Model, Document } from "mongoose";
import { Account } from "../middlewares";

export interface LoadConfig {
  account?: Account;
  address?: string;
  ip?: string;
}

export class LogService {
  readonly logger: Logger;
  constructor(name: string) {
    this.logger = new Logger(name);
  }
}
export class LoadService<Mdl extends Model<any>, Doc extends Document<any>, Input> extends LogService {
  loader: DataLoader<Id, Doc>;
  model: Mdl;
  constructor(private name: string, model: Mdl) {
    super(name);
    this.loader = createLoader(model);
    this.model = model;
  }
  async load(id?: Id) {
    const loader = (id && (await this.loader.load(id))) as Doc | null;
    return loader;
  }
  async loadMany(ids: Id[]) {
    return (await this.loader.loadMany(ids)) as Doc[];
  }
  async get(id: Id): Promise<Doc> {
    // const doc = await this.model.findOne({ _id: id });
    const doc = await this.load(id);
    if (!doc) throw new Error(`No Document (${this.name}): ${id}`);
    return doc;
  }
  async list(query: Query<Doc>, skip = 0, limit = 0): Promise<Doc[]> {
    return await this.model
      .find({ status: { $ne: "inactive" }, ...query })
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
  async create(data: Input, config?: LoadConfig): Promise<Doc> {
    return await new this.model(data).save();
  }
  async update(id: Id, data: Partial<Doc>, config?: LoadConfig): Promise<Doc> {
    const doc = await this.get(id);
    if (!doc) throw new Error(`No Document (${this.name}): ${id}`);
    Object.assign(doc, data);
    return await doc.save();
  }
  async remove(id: Id, config: LoadConfig = {}): Promise<Doc> {
    const doc = await this.get(id);
    if (!doc) throw new Error(`No Document (${this.name}): ${id}`);
    Object.assign(doc, { status: "inactive" });
    return await doc.save();
  }
}
export class AddrLoadService<Mdl extends Model<any>, Doc extends Document<any>, Input> extends LoadService<
  Mdl,
  Doc,
  Input
> {
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
