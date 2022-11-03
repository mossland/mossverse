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
} from "@shared/util-client";
import { Network } from "../network/network.gql";

@InputType("ContractInput")
export class ContractInput {
  @Field(() => Network)
  network: Network;

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

export const contractGraphQL = createGraphQL<"contract", Contract, ContractInput>(Contract, ContractInput);
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
