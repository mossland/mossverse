import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import {
  createGraphQL,
  Field,
  InputType,
  mutate,
  query,
  ObjectType,
  BaseGql,
  PickType,
  SliceModel,
} from "@shared/util-client";
import { gql as platform } from "@platform/data-access";

@InputType("MocWalletInput")
export class MocWalletInput {
  @Field(() => String)
  address: string;

  @Field(() => platform.User)
  user: platform.User;
}

@ObjectType("MocWallet", { _id: "id" })
export class MocWallet extends BaseGql(MocWalletInput) {
  @Field(() => String)
  type: cnst.MocWalletType;

  @Field(() => Date)
  expireAt: Date;

  @Field(() => String)
  status: cnst.MocWalletStatus;
}
@ObjectType("LightMocWallet", { _id: "id", gqlRef: "MocWallet" })

// ! 라이트 모델 지정 필요
export class LightMocWallet extends PickType(MocWallet, ["status"] as const) {}

export const mocWalletGraphQL = createGraphQL("mocWallet" as const, MocWallet, MocWalletInput, LightMocWallet);
export const {
  getMocWallet,
  listMocWallet,
  mocWalletCount,
  mocWalletExists,
  createMocWallet,
  updateMocWallet,
  removeMocWallet,
  mocWalletFragment,
  purifyMocWallet,
  defaultMocWallet,
} = mocWalletGraphQL;
export type MocWalletSlice = SliceModel<"mocWallet", MocWallet, LightMocWallet>;

// * GetActiveMocWallet Mutation
export type GetActiveMocWalletQuery = { getActiveMocWallet: MocWallet };
export const getActiveMocWalletQuery = graphql`
  ${mocWalletFragment}
  query getActiveMocWalletQuery {
    getActiveMocWallet {
      ...mocWalletFragment
    }
  }
`;

export const getActiveMocWallet = async () =>
  (await query<GetActiveMocWalletQuery>(getActiveMocWalletQuery, {})).getActiveMocWallet;

// * Deposit Mutation
export type DepositMutation = { deposit: MocWallet };
export const depositMutation = graphql`
  ${mocWalletFragment}
  mutation deposit($userId: ID!) {
    deposit(userId: $userId) {
      ...mocWalletFragment
    }
  }
`;

export const deposit = async (userId: string) => (await mutate<DepositMutation>(depositMutation, { userId })).deposit;

// * Withdraw Mutation
export type WithdrawMutation = { withdraw: platform.Receipt };
export const withdrawMutation = graphql`
  ${platform.receiptFragment}
  mutation withdraw($userId: ID!, $address: String!, $amount: Float!) {
    withdraw(userId: $userId, address: $address, amount: $amount) {
      ...receiptFragment
    }
  }
`;

export const withdraw = async (userId: string, address: string, amount: number) =>
  (await mutate<WithdrawMutation>(withdrawMutation, { userId, address, amount })).withdraw;
