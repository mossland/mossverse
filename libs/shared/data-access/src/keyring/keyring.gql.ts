import { query, mutate } from "../apollo";
import gql from "graphql-tag";
import { types } from "..";

export type EncryptMutation = { encrypt: string };
export const encryptMutation = gql`
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

export type SigninWithAddressMutation = { signinWithAddress: { accessToken: string } };

export const signinWithAddressMutation = gql`
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

export type SigninUserMutation = { signinUser: { accessToken: string } };

export const signinUserMutation = gql`
  mutation signinUser($userId: ID!) {
    signinUser(userId: $userId) {
      accessToken
    }
  }
`;

// * keyringHasWallet Query
export type KeyringHasWalletQuery = { keyringHasWallet: types.Keyring[] };
export const keyringHasWalletQuery = gql`
  ${types.keyringFragment}
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
export const generateOtpMutation = gql`
  mutation generateOtp {
    generateOtp {
      otp
    }
  }
`;
export const generateOtp = async () => (await mutate<GenerateOtpMutation>(generateOtpMutation)).generateOtp;

// * AddWallet Mutation
export type AddWalletMutation = { addWallet: types.Keyring };
export const addWalletMutation = gql`
  ${types.keyringFragment}
  mutation addWallet($keyringId: ID!, $networkId: ID!) {
    addWallet(keyringId: $keyringId, networkId: $networkId) {
      ...keyringFragment
    }
  }
`;

export const addWallet = async (keyringId: string, networkId: string) =>
  (await mutate<AddWalletMutation>(addWalletMutation, { keyringId, networkId })).addWallet;

export type SigninWithOtpMutation = { signinWithOtp: { accessToken: string } };

export const signinWithOtpMutation = gql`
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
export type RemoveWalletMutation = { removeWallet: types.Keyring };
export const removeWalletMutation = gql`
  ${types.keyringFragment}
  mutation removeWallet($keyringId: ID!, $walletId: ID!, $address: ID!) {
    removeWallet(keyringId: $keyringId, walletId: $walletId, address: $address) {
      ...keyringFragment
    }
  }
`;
export const removeWallet = async (keyringId: string, walletId: string, address: string) =>
  (await mutate<RemoveWalletMutation>(removeWalletMutation, { keyringId, walletId, address })).removeWallet;
