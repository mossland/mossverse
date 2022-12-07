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
  JSON,
  BaseGql,
  PickType,
  SliceModel,
  ID,
} from "@shared/util-client";
import { LightWallet, Wallet } from "../wallet/wallet.gql";
import { Contract, LightContract } from "../contract/contract.gql";

@InputType("KeyringInput")
export class KeyringInput {}

@ObjectType("Keyring", { _id: "id" })
export class Keyring extends BaseGql(KeyringInput) {
  @Field(() => ID, { nullable: true })
  user?: string;

  @Field(() => String)
  accountId: string;

  @Field(() => [Wallet])
  wallets: (Wallet | LightWallet)[];

  @Field(() => [Contract])
  holds: (Contract | LightContract)[];

  @Field(() => JSON)
  discord: Record<string, any> | null;

  @Field(() => String)
  status: cnst.KeyringStatus;
}
@ObjectType("LightKeyring", { _id: "id", gqlRef: "Keyring" })
export class LightKeyring extends PickType(Keyring, ["status"] as const) {}

export const keyringGraphQL = createGraphQL("keyring" as const, Keyring, KeyringInput, LightKeyring);
export const {
  getKeyring,
  listKeyring,
  keyringCount,
  keyringExists,
  createKeyring,
  updateKeyring,
  removeKeyring,
  keyringFragment,
  purifyKeyring,
  defaultKeyring,
} = keyringGraphQL;
export type KeyringSlice = SliceModel<"keyring", Keyring, LightKeyring>;

export type EncryptMutation = { encrypt: string };
export const encryptMutation = graphql`
  mutation encrypt($data: String!) {
    encrypt(data: $data)
  }
`;

export const encrypt = async (data: string) =>
  (
    await mutate<EncryptMutation>(encryptMutation, {
      data,
    })
  ).encrypt;

export type MyKeyringQuery = { myKeyring: Keyring };
export const myKeyringQuery = graphql`
  ${keyringFragment}
  query myKeyring {
    myKeyring {
      ...keyringFragment
    }
  }
`;
export const myKeyring = async () => (await mutate<MyKeyringQuery>(myKeyringQuery)).myKeyring;

export type SigninWithAddressMutation = { signinWithAddress: { accessToken: string } };

export const signinWithAddressMutation = graphql`
  mutation signinWithAddress($networkId: ID!) {
    signinWithAddress(networkId: $networkId) {
      accessToken
    }
  }
`;

export const signinWithAddress = async (networkId: string) =>
  (
    await mutate<SigninWithAddressMutation>(signinWithAddressMutation, {
      networkId,
    })
  ).signinWithAddress.accessToken;

export type SigninWithPasswordMutation = { signinWithPassword: { accessToken: string } };
export const signinWithPasswordMutation = graphql`
  mutation signinWithPassword($accountId: String!, $password: String!) {
    signinWithPassword(accountId: $accountId, password: $password) {
      accessToken
    }
  }
`;
export const signinWithPassword = async (accountId: string, password: string) =>
  (
    await mutate<SigninWithPasswordMutation>(signinWithPasswordMutation, {
      accountId,
      password,
    })
  ).signinWithPassword.accessToken;

export type SignupWithPasswordMutation = { signupWithPassword: { accessToken: string } };
export const signupWithPasswordMutation = graphql`
  mutation signupWithPassword($accountId: String!, $password: String!) {
    signupWithPassword(accountId: $accountId, password: $password) {
      accessToken
    }
  }
`;
export const signupWithPassword = async (accountId: string, password: string) =>
  (
    await mutate<SignupWithPasswordMutation>(signupWithPasswordMutation, {
      accountId,
      password,
    })
  ).signupWithPassword.accessToken;

export type ChangePasswordMutation = { changePassword: { accessToken: string } };
export const changePasswordMutation = graphql`
  mutation changePassword($keyringId: ID!, $password: String!, $prevPassword: String!) {
    changePassword(keyringId: $keyringId, password: $password, prevPassword: $prevPassword) {
      accessToken
    }
  }
`;
export const changePassword = async (keyringId: string, password: string, prevPassword: string) =>
  (
    await mutate<ChangePasswordMutation>(changePasswordMutation, {
      keyringId,
      password,
      prevPassword,
    })
  ).changePassword.accessToken;

export type ResetPasswordMutation = { resetPassword: boolean };
export const resetPasswordMutation = graphql`
  mutation resetPassword($accountId: String!) {
    resetPassword(accountId: $accountId)
  }
`;
export const resetPassword = async (accountId: string) =>
  (
    await mutate<ResetPasswordMutation>(resetPasswordMutation, {
      accountId,
    })
  ).resetPassword;

export type SigninUserMutation = { signinUser: { accessToken: string } };

export const signinUserMutation = graphql`
  mutation signinUser($userId: ID!) {
    signinUser(userId: $userId) {
      accessToken
    }
  }
`;

// * keyringHasWallet Query
export type KeyringHasWalletQuery = { keyringHasWallet: Keyring[] };
export const keyringHasWalletQuery = graphql`
  ${keyringFragment}
  query keyringHasWallet($networkId: ID!) {
    keyringHasWallet(networkId: $networkId) {
      ...keyringFragment
    }
  }
`;
export const keyringHasWallet = async (networkId: string) =>
  (await query<KeyringHasWalletQuery>(keyringHasWalletQuery, { networkId })).keyringHasWallet;

// * generateOtp mutation
export type GenerateOtpMutation = { generateOtp: { otp: string } };
export const generateOtpMutation = graphql`
  mutation generateOtp {
    generateOtp {
      otp
    }
  }
`;
export const generateOtp = async () => (await mutate<GenerateOtpMutation>(generateOtpMutation)).generateOtp;

// * AddWallet Mutation
export type AddWalletMutation = { addWallet: Keyring };
export const addWalletMutation = graphql`
  ${keyringFragment}
  mutation addWallet($keyringId: ID!, $networkId: ID!) {
    addWallet(keyringId: $keyringId, networkId: $networkId) {
      ...keyringFragment
    }
  }
`;

export const addWallet = async (keyringId: string, networkId: string) =>
  (await mutate<AddWalletMutation>(addWalletMutation, { keyringId, networkId })).addWallet;

export type SigninWithOtpMutation = { signinWithOtp: { accessToken: string } };

export const signinWithOtpMutation = graphql`
  mutation signinWithOtp($otp: String!) {
    signinWithOtp(otp: $otp) {
      accessToken
    }
  }
`;

export const signinWithOtp = async (otp: string) =>
  (
    await mutate<SigninWithOtpMutation>(signinWithOtpMutation, {
      otp,
    })
  ).signinWithOtp.accessToken;

// * RemoveWallet Mutation
export type RemoveWalletMutation = { removeWallet: Keyring };
export const removeWalletMutation = graphql`
  ${keyringFragment}
  mutation removeWallet($keyringId: ID!, $walletId: ID!, $address: ID!) {
    removeWallet(keyringId: $keyringId, walletId: $walletId, address: $address) {
      ...keyringFragment
    }
  }
`;
export const removeWallet = async (keyringId: string, walletId: string, address: string) =>
  (await mutate<RemoveWalletMutation>(removeWalletMutation, { keyringId, walletId, address })).removeWallet;
