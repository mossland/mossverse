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
  BaseGql,
  BaseArrayFieldGql,
  Int,
  ID,
  makeDefault,
  makePurify,
  PickType,
  SliceModel,
} from "@shared/util-client";

import { gql as shared } from "@shared/data-access";
import { gql as platform } from "@platform/data-access";

@InputType("UserInput")
export class UserInput extends shared.User {}

@ObjectType("User", { _id: "id" })
export class User extends UserInput {
  getMyItems(user: User): platform.MyItem[] {
    if (!user.keyring) return [];
    // let tokenItems: shared.TokenItem[] = [];
    return [];
    // user.keyring .wallets.map((wallet: shared.Wallet, idx: number) => {
    //   tokenItems = [
    //     ...tokenItems,
    //     ...wallet.items,
    //     // .filter((item) => item.type !== "root")
    //   ];
    // });
    // return [
    //   ...tokenItems.map((item): platform.MyItem => ({ token: item.token, type: "token", num: item.num })),
    //   ...user.items
    //     .filter((item) => item.thing.type !== "root")
    //     .map((item): platform.MyItem => ({ thing: item.thing, type: "thing", num: item.num })),
    // ];
  }
  getThing(name: string) {
    return this.items.find((item) => item.thing.name === name);
  }

  static getThings(self: User, names: string[]): shared.ThingItem[] {
    // filter names from user.items
    return self.items.filter((item) => names.includes(item.thing.name));
  }

  filterMyItems(self: User, listings: platform.LightListing[]) {
    // const { self, myItems } = get();
    const myItems = self.getMyItems(self);

    if (!self || !myItems) return [];
    const myListing = listings.filter((listing) => listing.user.id === self.id);
    return myItems.filter((item) => {
      const rst = myListing.some(
        (listing) =>
          (item.thing && listing.thing && listing.thing.id === item.thing.id) ||
          (item.token && listing.token && listing.token.id === item.token.id)
      );
      return !rst;
    });
  }
}

@ObjectType("LightUser", { _id: "id", gqlRef: "User" })
export class LightUser extends PickType(User, ["nickname", "status"] as const) {}

export const userGraphQL = createGraphQL("user" as const, User, UserInput, LightUser);
export const {
  getUser,
  listUser,
  userCount,
  userExists,
  createUser,
  updateUser,
  removeUser,
  userFragment,
  purifyUser,
  defaultUser,
} = userGraphQL;
export type UserSlice = SliceModel<"user", User, LightUser>;

// * WhoAmI Query
export type WhoAmIQuery = { whoAmI: User };

export const whoAmIQuery = graphql`
  ${userFragment}
  query whoAmI {
    whoAmI {
      ...userFragment
    }
  }
`;

export const whoAmI = async () => (await query<WhoAmIQuery>(whoAmIQuery)).whoAmI;

// * GetUserTokenList Query
export type GetUserTokenListQuery = { getUserTokenList: [number] };
export const getUserTokenListQuery = graphql`
  query getUserTokenList($address: String!, $contract: String!) {
    getUserTokenList(address: $address, contract: $contract)
  }
`;
