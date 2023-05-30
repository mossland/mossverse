import { Field, ID, InputType, Int, ObjectType, PickType, createGraphQL, graphql, query } from "@util/client";
import { fetch as shared } from "@shared/client";

@InputType("UserInput", { isAbstract: true })
export class UserInput extends shared.User {
  @Field(() => [Int])
  currentPosition: number[];

  @Field(() => ID, { nullable: true })
  currentMap: string | null;
}

@ObjectType("User", { _id: "id", isAbstract: true })
export class User extends UserInput {}

@ObjectType("LightUser", { _id: "id", gqlRef: "User", isAbstract: true })
export class LightUser extends PickType(User, ["status"] as const) {}

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
  lightUserFragment,
  purifyUser,
  crystalizeUser,
  lightCrystalizeUser,
  defaultUser,
  mergeUser,
} = userGraphQL;

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
export const whoAmI = async () => crystalizeUser((await query<WhoAmIQuery>(whoAmIQuery)).whoAmI);
