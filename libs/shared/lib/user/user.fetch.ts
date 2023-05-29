import { BaseGql, Field, ID, InputType, ObjectType, PickType, cnst } from "@util/client";
import { File } from "../file/file.fetch";

@InputType("UserInput", { isAbstract: true })
export class UserInput {
  @Field(() => String, { nullable: true })
  nickname: string | null;

  @Field(() => File, { nullable: true })
  image: File | null;

  @Field(() => [String])
  requestRoles: cnst.UserRole[];
}

@ObjectType("User", { _id: "id", isAbstract: true })
export class User extends BaseGql(UserInput) {
  @Field(() => [String])
  roles: cnst.UserRole[];

  @Field(() => ID)
  keyring: string;

  @Field(() => String)
  status: cnst.UserStatus;
}

@ObjectType("LightUser", { _id: "id", gqlRef: "User", isAbstract: true })
export class LightUser extends PickType(User, ["image", "nickname"] as const) {}
