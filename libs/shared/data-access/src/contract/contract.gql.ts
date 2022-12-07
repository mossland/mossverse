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
  SliceModel,
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

  @Field(() => Date)
  snapshotAt: Date;

  @Field(() => String)
  status: cnst.ContractStatus;
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
  defaultContract,
} = contractGraphQL;
export type ContractSlice = SliceModel<"contract", Contract, LightContract>;

// * Snapshot Contract Query
export type SnapshotContractMutation = { snapshotContract: Contract };
export const snapshotContractMutation = graphql`
  ${contractFragment}
  mutation snapshotContract($contractId: ID!) {
    snapshotContract(contractId: $contractId) {
      ...contractFragment
    }
  }
`;
export const snapshotContract = async (contractId: string) =>
  (await query<SnapshotContractMutation>(snapshotContractMutation, { contractId })).snapshotContract;

// * Get Contract Snapshot Query
export type GetContractSnapshotQuery = { getContractSnapshot: Contract };
export const getContractSnapshotQuery = graphql`
  ${contractFragment}
  mutation getContractSnapshot($contractId: ID!) {
    getContractSnapshot(contractId: $contractId) {
      ...contractFragment
    }
  }
`;
export const getContractSnapshot = async (contractId: string) =>
  (await query<GetContractSnapshotQuery>(getContractSnapshotQuery, { contractId })).getContractSnapshot;
