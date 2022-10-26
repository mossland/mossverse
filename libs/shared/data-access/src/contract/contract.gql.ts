import { query, mutate } from "../apollo";
import * as types from "./contract.types";
import gql from "graphql-tag";

// * Contract Query
export type ContractQuery = { contract: types.Contract };
export const contractQuery = gql`
  ${types.contractFragment}
  query contract($contractId: ID!) {
    contract(contractId: $contractId) {
      ...contractFragment
    }
  }
`;
export const contract = async (contractId: string) =>
  (await query<ContractQuery>(contractQuery, { contractId })).contract;

// * Contracts Query
export type ContractsQuery = { contracts: types.Contract[] };
export const contractsQuery = gql`
  ${types.contractFragment}
  query contracts($query: JSON!, $skip: Int, $limit: Int) {
    contracts(query: $query, skip: $skip, limit: $limit) {
      ...contractFragment
    }
    contractCount(query: $query)
  }
`;
export const contracts = async (qry: any, skip = 0, limit = 0) =>
  (await query<ContractsQuery>(contractsQuery, { query: qry, skip, limit })).contracts;

// * Create Contract Mutation
export type CreateContractMutation = { createContract: types.Contract };
export const createContractMutation = gql`
  ${types.contractFragment}
  mutation createContract($data: ContractInput!) {
    createContract(data: $data) {
      ...contractFragment
    }
  }
`;
export const createContract = async (data: types.ContractInput) =>
  (await mutate<CreateContractMutation>(createContractMutation, { data })).createContract;

// * Remove Contract Mutation
export type RemoveContractMutation = { removeContract: types.Contract };
export const removeContractMutation = gql`
  ${types.contractFragment}
  mutation removeContract($contractId: ID!) {
    removeContract(contractId: $contractId) {
      ...contractFragment
    }
  }
`;
export const removeContract = async (contractId: string) =>
  (await mutate<RemoveContractMutation>(removeContractMutation, { contractId })).removeContract;

// * Update Contract Mutation
export type UpdateContractMutation = { updateContract: types.Contract };
export const updateContractMutation = gql`
  ${types.contractFragment}
  mutation updateContract($data: ContractInput!, $contractId: ID!) {
    updateContract(data: $data, contractId: $contractId) {
      ...contractFragment
    }
  }
`;
export const updateContract = async (contractId: string, data: types.ContractInput) =>
  (await mutate<UpdateContractMutation>(updateContractMutation, { data, contractId })).updateContract;

// * Snapshot Contract Query
export type SnapshotContractMutation = { snapshotContract: types.Contract };
export const snapshotContractMutation = gql`
  ${types.contractFragment}
  mutation snapshotContract($contractId: ID!) {
    snapshotContract(contractId: $contractId) {
      ...contractFragment
    }
  }
`;
export const snapshotContract = async (contractId: string) =>
  (await query<SnapshotContractMutation>(snapshotContractMutation, { contractId })).snapshotContract;

// * Get Contract Snapshot Query
export type GetContractSnapshotQuery = { getContractSnapshot: types.Contract };
export const getContractSnapshotQuery = gql`
  ${types.contractFragment}
  mutation getContractSnapshot($contractId: ID!) {
    getContractSnapshot(contractId: $contractId) {
      ...contractFragment
    }
  }
`;
export const getContractSnapshot = async (contractId: string) =>
  (await query<GetContractSnapshotQuery>(getContractSnapshotQuery, { contractId })).getContractSnapshot;
