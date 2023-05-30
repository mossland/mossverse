import { AccessToken, accessTokenFragment } from "../_shared/shared.fetch";
import {
  BaseGql,
  Field,
  ID,
  InputType,
  Int,
  JSON,
  ObjectType,
  PickType,
  cnst,
  createGraphQL,
  graphql,
  mutate,
  query,
} from "@util/client";
import { Contract, LightContract } from "../contract/contract.fetch";
import { LightWallet, Wallet } from "../wallet/wallet.fetch";
import dayjs, { Dayjs } from "dayjs";

@InputType("KeyringInput")
export class KeyringInput {
  @Field(() => String, { nullable: true })
  name: string | null;
}

@ObjectType("Keyring", { _id: "id" })
export class Keyring extends BaseGql(KeyringInput) {
  @Field(() => ID, { nullable: true })
  user: string | null;

  @Field(() => [Wallet])
  wallets: (Wallet | LightWallet)[];

  @Field(() => [Contract])
  holds: (Contract | LightContract)[];

  @Field(() => JSON)
  discord: Record<string, any> | null;

  @Field(() => String, { nullable: true })
  accountId: string | null;

  @Field(() => String, { nullable: true })
  phone: string | null;

  @Field(() => [Date])
  phoneCodeAts: Dayjs[];

  @Field(() => [String])
  verifies: cnst.Verify[];

  @Field(() => Boolean)
  isOnline: boolean;

  @Field(() => Date)
  lastLoginAt: Dayjs;

  @Field(() => String)
  status: cnst.KeyringStatus;

  isPhoneVerified() {
    return (
      this.verifies.includes("phone") &&
      this.phoneCodeAts.at(-1) &&
      dayjs(this.phoneCodeAts.at(-1)).isAfter(dayjs().subtract(3, "minutes"))
    );
  }
}
@ObjectType("LightKeyring", { _id: "id", gqlRef: "Keyring" })
export class LightKeyring extends PickType(Keyring, ["name", "isOnline", "lastLoginAt", "status"] as const) {}

@ObjectType("KeyringSummary")
export class KeyringSummary {
  @Field(() => Int)
  totalKeyring: number;
}

export const keyringQueryMap = {
  totalKeyring: { status: { $ne: "inactive" } },
};

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
  lightKeyringFragment,
  viewKeyring,
  initKeyring,
  purifyKeyring,
  crystalizeKeyring,
  lightCrystalizeKeyring,
  defaultKeyring,
  mergeKeyring,
} = keyringGraphQL;

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
export const myKeyring = async () => crystalizeKeyring((await query<MyKeyringQuery>(myKeyringQuery)).myKeyring);

//*=================================================================*//
//*====================== Wallet Signing Area ======================*//
export type GetKeyringIdHasWalletQuery = {
  getKeyringIdHasWallet: string | null;
};
export const getKeyringIdHasWalletQuery = graphql`
  query getKeyringIdHasWallet($networkId: ID!) {
    getKeyringIdHasWallet(networkId: $networkId)
  }
`;
export const getKeyringIdHasWallet = async (networkId: string) =>
  (
    await query<GetKeyringIdHasWalletQuery>(getKeyringIdHasWalletQuery, {
      networkId,
    })
  ).getKeyringIdHasWallet;

export type SignupWalletMutation = { signupWallet: Keyring };
export const signupWalletMutation = graphql`
  ${keyringFragment}
  mutation signupWallet($networkId: ID!, $keyringId: ID) {
    signupWallet(networkId: $networkId, keyringId: $keyringId) {
      ...keyringFragment
    }
  }
`;
export const signupWallet = async (networkId: string, keyringId?: string) =>
  crystalizeKeyring(
    (
      await mutate<SignupWalletMutation>(signupWalletMutation, {
        networkId,
        keyringId,
      })
    ).signupWallet
  );

export type SigninWalletMutation = { signinWallet: AccessToken };
export const signinWalletMutation = graphql`
  ${accessTokenFragment}
  mutation signinWallet($networkId: ID!) {
    signinWallet(networkId: $networkId) {
      ...accessTokenFragment
    }
  }
`;
export const signinWallet = async (networkId: string) =>
  (await mutate<SigninWalletMutation>(signinWalletMutation, { networkId })).signinWallet.jwt;

export type SignaddWalletMutation = { signaddWallet: Keyring };
export const signaddWalletMutation = graphql`
  ${keyringFragment}
  mutation signaddWallet($networkId: ID!) {
    signaddWallet(keyringId: $keyringId, networkId: $networkId) {
      ...keyringFragment
    }
  }
`;
export const signaddWallet = async (networkId: string) =>
  crystalizeKeyring((await mutate<SignaddWalletMutation>(signaddWalletMutation, { networkId })).signaddWallet);

// * SignsubWallet Mutation
export type SignsubWalletMutation = { signsubWallet: Keyring };
export const signsubWalletMutation = graphql`
  ${keyringFragment}
  mutation signsubWallet($walletId: ID!) {
    signsubWallet(walletId: $walletId) {
      ...keyringFragment
    }
  }
`;
export const signsubWallet = async (walletId: string) =>
  crystalizeKeyring((await mutate<SignsubWalletMutation>(signsubWalletMutation, { walletId })).signsubWallet);

//*====================== Wallet Signing Area ======================*//
//*=================================================================*//

//*===================================================================*//
//*====================== Password Signing Area ======================*//
export type GetKeyringIdHasAccountIdQuery = {
  getKeyringIdHasAccountId: string | null;
};
export const getKeyringIdHasAccountIdQuery = graphql`
  query getKeyringIdHasAccountId($accountId: String!) {
    getKeyringIdHasAccountId(accountId: $accountId)
  }
`;
export const getKeyringIdHasAccountId = async (accountId: string) =>
  (
    await query<GetKeyringIdHasAccountIdQuery>(getKeyringIdHasAccountIdQuery, {
      accountId,
    })
  ).getKeyringIdHasAccountId;

export type SignupPasswordMutation = { signupPassword: Keyring };
export const signupPasswordMutation = graphql`
  ${keyringFragment}
  mutation signupPassword($accountId: String!, $password: String!, $token: String!, $keyringId: ID) {
    signupPassword(accountId: $accountId, password: $password, token: $token, keyringId: $keyringId) {
      ...keyringFragment
    }
  }
`;
export const signupPassword = async (accountId: string, password: string, token: string, keyringId?: string) =>
  crystalizeKeyring(
    (
      await mutate<SignupPasswordMutation>(signupPasswordMutation, {
        accountId,
        password,
        token,
        keyringId,
      })
    ).signupPassword
  );

export type SigninPasswordMutation = { signinPassword: AccessToken };
export const signinPasswordMutation = graphql`
  mutation signinPassword($accountId: String!, $password: String!, $token: String!) {
    signinPassword(accountId: $accountId, password: $password, token: $token) {
      jwt
    }
  }
`;
export const signinPassword = async (accountId: string, password: string, token: string) =>
  (
    await mutate<SigninPasswordMutation>(signinPasswordMutation, {
      accountId,
      password,
      token,
    })
  ).signinPassword.jwt;

export type SignaddPasswordMutation = { signaddPassword: Keyring };
export const signaddPasswordMutation = graphql`
  ${keyringFragment}
  mutation signaddPassword($accountId: String!, $password: String!, $token: String!) {
    signaddPassword(accountId: $accountId, password: $password, token: $token) {
      ...keyringFragment
    }
  }
`;
export const signaddPassword = async (accountId: string, password: string, token: string) =>
  crystalizeKeyring(
    (
      await mutate<SignaddPasswordMutation>(signaddPasswordMutation, {
        accountId,
        password,
        token,
      })
    ).signaddPassword
  );

export type ChangePasswordMutation = { changePassword: boolean };
export const changePasswordMutation = graphql`
  mutation changePassword($password: String!, $prevPassword: String!, $token: String!) {
    changePassword(password: $password, prevPassword: $prevPassword, token: $token)
  }
`;
export const changePassword = async (password: string, prevPassword: string, token: string) =>
  (
    await mutate<ChangePasswordMutation>(changePasswordMutation, {
      password,
      prevPassword,
      token,
    })
  ).changePassword;

export type ChangePasswordWithPhoneMutation = {
  changePasswordWithPhone: boolean;
};
export const changePasswordWithPhoneMutation = graphql`
  mutation changePasswordWithPhone($password: String!, $phone: String!, $phoneCode: String!) {
    changePasswordWithPhone(password: $password, phone: $phone, phoneCode: $phoneCode)
  }
`;
export const changePasswordWithPhone = async (password: string, phone: string, phoneCode: string) =>
  (await mutate<ChangePasswordWithPhoneMutation>(changePasswordWithPhoneMutation, { password, phone, phoneCode }))
    .changePasswordWithPhone;

export type ResetPasswordMutation = { resetPassword: boolean };
export const resetPasswordMutation = graphql`
  mutation resetPassword($accountId: String!) {
    resetPassword(accountId: $accountId)
  }
`;
export const resetPassword = async (accountId: string) =>
  (await mutate<ResetPasswordMutation>(resetPasswordMutation, { accountId })).resetPassword;

//*====================== Password Signing Area ======================*//
//*===================================================================*//

//*================================================================*//
//*====================== Phone Signing Area ======================*//
export type GetKeyringIdHasPhoneQuery = { getKeyringIdHasPhone: string | null };
export const getKeyringIdHasPhoneQuery = graphql`
  query getKeyringIdHasPhone($phone: String!) {
    getKeyringIdHasPhone(phone: $phone)
  }
`;
export const getKeyringIdHasPhone = async (phone: string) =>
  (await query<GetKeyringIdHasPhoneQuery>(getKeyringIdHasPhoneQuery, { phone })).getKeyringIdHasPhone;

export type AddPhoneInPrepareKeyringMutation = {
  addPhoneInPrepareKeyring: Keyring;
};
export const addPhoneInPrepareKeyringMutation = graphql`
  ${keyringFragment}
  mutation addPhoneInPrepareKeyring($phone: String!, $keyringId: ID) {
    addPhoneInPrepareKeyring(phone: $phone, keyringId: $keyringId) {
      ...keyringFragment
    }
  }
`;
export const addPhoneInPrepareKeyring = async (phone: string, keyringId: string | null) =>
  crystalizeKeyring(
    (await mutate<AddPhoneInPrepareKeyringMutation>(addPhoneInPrepareKeyringMutation, { phone, keyringId }))
      .addPhoneInPrepareKeyring
  );

export type AddPhoneInActiveKeyringMutation = {
  addPhoneInActiveKeyring: Keyring;
};
export const addPhoneInActiveKeyringMutation = graphql`
  ${keyringFragment}
  mutation addPhoneInActiveKeyring($phone: String!) {
    addPhoneInActiveKeyring(phone: $phone) {
      ...keyringFragment
    }
  }
`;
export const addPhoneInActiveKeyring = async (phone: string) =>
  crystalizeKeyring(
    (await mutate<AddPhoneInActiveKeyringMutation>(addPhoneInActiveKeyringMutation, { phone })).addPhoneInActiveKeyring
  );

export type requestPhoneCodeMutation = { requestPhoneCode: Date };
export const requestPhoneCodeMutation = graphql`
  mutation requestPhoneCode($keyringId: ID!, $phone: String!, $hash: String!) {
    requestPhoneCode(keyringId: $keyringId, phone: $phone, hash: $hash)
  }
`;
export const requestPhoneCode = async (keyringId: string, phone: string, hash: string) =>
  dayjs(
    (
      await mutate<requestPhoneCodeMutation>(requestPhoneCodeMutation, {
        keyringId,
        phone,
        hash,
      })
    ).requestPhoneCode
  );
export type verifyPhoneCodeMutation = { verifyPhoneCode: Keyring };
export const verifyPhoneCodeMutation = graphql`
  ${keyringFragment}
  mutation verifyPhoneCode($keyringId: ID!, $phone: String!, $phoneCode: String!) {
    verifyPhoneCode(keyringId: $keyringId, phone: $phone, phoneCode: $phoneCode) {
      ...keyringFragment
    }
  }
`;
export const verifyPhoneCode = async (keyringId: string, phone: string, phoneCode: string) =>
  crystalizeKeyring(
    (
      await mutate<verifyPhoneCodeMutation>(verifyPhoneCodeMutation, {
        keyringId,
        phone,
        phoneCode,
      })
    ).verifyPhoneCode
  );

export type SignupPhoneMutation = { signupPhone: Keyring };
export const signupPhoneMutation = graphql`
  ${keyringFragment}
  mutation signupPhone($keyringId: ID!, $phone: String!, $phoneCode: String!) {
    signupPhone(keyringId: $keyringId, phone: $phone, phoneCode: $phoneCode) {
      ...keyringFragment
    }
  }
`;
export const signupPhone = async (keyringId: string, phone: string, phoneCode: string) =>
  crystalizeKeyring(
    (
      await mutate<SignupPhoneMutation>(signupPhoneMutation, {
        keyringId,
        phone,
        phoneCode,
      })
    ).signupPhone
  );

export type SignaddPhoneMutation = { signaddPhone: Keyring };
export const signaddPhoneMutation = graphql`
  ${keyringFragment}
  mutation signaddPhone($phone: String!, $phoneCode: String!) {
    signaddPhone(phone: $phone, phonecode: $phoneCode) {
      ...keyringFragment
    }
  }
`;
export const signaddPhone = async (phone: string, phoneCode: string) =>
  crystalizeKeyring(
    (
      await mutate<SignaddPhoneMutation>(signaddPhoneMutation, {
        phone,
        phoneCode,
      })
    ).signaddPhone
  );

export type SigninPhoneMutation = { signinPhone: AccessToken };
export const signinPhoneMutation = graphql`
  mutation signinPhone($keyringId: ID!, $phone: String!, $phoneCode: String!) {
    signinPhone(keyringId: $keyringId, phone: $phone, phoneCode: $phoneCode) {
      jwt
    }
  }
`;
export const signinPhone = async (keyringId: string, phone: string, phoneCode: string) =>
  (
    await mutate<SigninPhoneMutation>(signinPhoneMutation, {
      keyringId,
      phone,
      phoneCode,
    })
  ).signinPhone.jwt;
//*====================== Phone Signing Area ======================*//
//*================================================================*//

export type ActivateUserMutation = { activateUser: Keyring };
export const activateUserMutation = graphql`
  ${keyringFragment}
  mutation activateUser($keyringId: ID!) {
    activateUser(keyringId: $keyringId) {
      ...keyringFragment
    }
  }
`;
export const activateUser = async (keyringId: string) =>
  crystalizeKeyring((await mutate<ActivateUserMutation>(activateUserMutation, { keyringId })).activateUser);
