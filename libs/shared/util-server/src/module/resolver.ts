// https://github.com/nestjs/graphql/issues/755
import { Args, Int, Mutation, Query, Resolver, ID } from "@nestjs/graphql";
import { Id, Query as DbQuery } from "../dbConfig";
import { LoadService } from "./service";
import { Model, Document } from "mongoose";
import { Utils } from "@shared/util";
const { capitalize, lowerlize } = Utils;
import { Ip, UseGuards } from "@nestjs/common";
import { Account, Allow, Auth, Signature, UserIp } from "../middlewares";
import JSON from "graphql-type-json";
import * as pluralize from "pluralize";

interface BaseEntity extends Function {
  new (...any: any[]): any;
  [key: string]: any;
}
interface DocInput extends Function {
  new (...any: any[]): any;
}
interface AuthPolicy extends Function {
  new (...any: any[]): any;
}
export interface BaseResolverConstructor<Mdl extends Model<any>, Doc extends Document<any>, Input> {
  new (service: LoadService<Mdl, Doc, Input>): BaseResolverInstance<Doc, Input>;
}

export interface BaseResolverInstance<Doc, Input> {
  get(id: string): Promise<Doc>;
  list(query: DbQuery<Doc>, skip: number, limit: number): Promise<Doc[]>;
  count(query: DbQuery<Doc>): Promise<number>;
  create(data: Input): Promise<Doc>;
  update(id: string, data: Partial<Input>): Promise<Doc>;
  remove(id: string): Promise<Doc>;
}

export function BaseResolver<
  T extends BaseEntity,
  I extends DocInput,
  Mdl extends Model<any>,
  Doc extends Document<any>,
  Input
>(classRef: T, inputRef: I, get?: AuthPolicy, list?: AuthPolicy, cru?: AuthPolicy): any {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    constructor(private readonly service: LoadService<Mdl, Doc, Input>) {}

    @UseGuards(get ?? Allow.Public) // will be deprecated
    @Query(() => classRef, { name: `${lowerlize(classRef.name)}` })
    async getLegacy(@Args({ name: "id", type: () => ID }) id: string): Promise<Doc> {
      return await this.service.get(new Id(id));
    }
    @UseGuards(get ?? Allow.Public)
    @Query(() => classRef, { name: `get${classRef.name}` })
    async get(@Args({ name: `${Utils.lowerlize(classRef.name)}Id`, type: () => ID }) id: string): Promise<Doc> {
      // async get(@Args({ name: "id", type: () => ID }) id: string): Promise<Doc> {
      return await this.service.get(new Id(id));
    }

    @UseGuards(list ?? Allow.Public)
    @Query(() => [classRef], { name: `${pluralize(lowerlize(classRef.name))}` })
    // @Query(() => [classRef], { name: `list${lowerlize(classRef.name)}` })
    async listLegacy(
      // will be deprecated
      @Args({ name: "query", type: () => JSON }) query: DbQuery<Doc>,
      @Args({ name: "skip", type: () => Int, nullable: true }) skip: number,
      @Args({ name: "limit", type: () => Int, nullable: true }) limit: number
    ): Promise<Doc[]> {
      return await this.service.list(query, skip, limit);
    }
    @UseGuards(list ?? Allow.Public)
    @Query(() => [classRef], { name: `list${classRef.name}` })
    async list(
      @Args({ name: "query", type: () => JSON }) query: DbQuery<Doc>,
      @Args({ name: "skip", type: () => Int, nullable: true }) skip: number,
      @Args({ name: "limit", type: () => Int, nullable: true }) limit: number,
      @UserIp() ip: string
    ): Promise<Doc[]> {
      return await this.service.list(query, skip, limit);
    }
    @UseGuards(list ?? Allow.Public)
    @Query(() => Int, { name: `${lowerlize(classRef.name)}Count` })
    async count(@Args({ name: "query", type: () => JSON }) query: DbQuery<Doc>): Promise<number> {
      return await this.service.count(query);
    }
    @UseGuards(list ?? Allow.Public)
    @Query(() => Boolean, { name: `${lowerlize(classRef.name)}Exists` })
    async exists(@Args({ name: "query", type: () => JSON }) query: DbQuery<Doc>): Promise<boolean> {
      return await this.service.exists(query);
    }
    @UseGuards(cru ?? Allow.Public)
    @Mutation(() => classRef, { name: `create${capitalize(classRef.name)}` })
    async create(@Args({ name: `data`, type: () => inputRef }) data: Input): Promise<Doc> {
      return await this.service.create(data);
    }
    @UseGuards(cru ?? Allow.Public)
    @Mutation(() => classRef, { name: `update${capitalize(classRef.name)}` })
    async update(
      @Args({ name: `${Utils.lowerlize(classRef.name)}Id`, type: () => ID }) id: string,
      @Args({ name: "data", type: () => inputRef }) data: Partial<Doc>
    ): Promise<Doc> {
      return await this.service.update(new Id(id), data);
    }
    @UseGuards(cru ?? Allow.Public)
    @Mutation(() => classRef, { name: `remove${capitalize(classRef.name)}` })
    async remove(
      @Args({ name: `${Utils.lowerlize(classRef.name)}Id`, type: () => ID }) id: string,
      @Auth() account: Account
    ): Promise<Doc> {
      return await this.service.remove(new Id(id), { account });
    }
  }
  return BaseResolver as unknown as BaseResolverConstructor<Mdl, Doc, Input>;
}
