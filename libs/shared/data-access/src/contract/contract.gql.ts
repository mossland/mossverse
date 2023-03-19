import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import {
  createGraphQL,
  createFragment,
  Field,
  InputType,
  mutate,
  query,
  ObjectType,
  Int,
  BaseGql,
  PickType,
} from "@shared/util-client";
import { LightNetwork, Network } from "../network/network.gql";

@InputType("ContractInput")
export class ContractInput {
  @Field(() => Network)
  network: Network | LightNetwork;

  @Field(() => String)
  address: string;

  @Field(() => String, { nullable: true })
  displayName: string | null;
}

@ObjectType("Contract", { _id: "id" })
export class Contract extends BaseGql(ContractInput) {
  @Field(() => String)
  interface: cnst.ContractInterface;

  @Field(() => String)
  name: string;

  @Field(() => String)
  symbol: string;

  @Field(() => String)
  totalSupply: number;

  @Field(() => Int)
  bn: number;

  @Field(() => String)
  status: cnst.ContractStatus;

  static getByName(contractList: LightContract[], name: string) {
    return contractList.find((contract) => contract.name === name);
  }
}

@ObjectType("LightContract", { _id: "id", gqlRef: "Contract" })
export class LightContract extends PickType(Contract, [
  "displayName",
  "name",
  "network",
  "address",
  "status",
] as const) {
  @Field(() => LightNetwork)
  override network: LightNetwork;
}

@ObjectType("ContractSummary")
export class ContractSummary {
  @Field(() => Int)
  totalContract: number;
}

export const contractGraphQL = createGraphQL("contract" as const, Contract, ContractInput, LightContract);
export const {
  getContract,
  listContract,
  contractCount,
  contractExists,
  createContract,
  updateContract,
  removeContract,
  contractFragment,
  purifyContract,
  crystalizeContract,
  lightCrystalizeContract,
  defaultContract,
  mergeContract,
} = contractGraphQL;
