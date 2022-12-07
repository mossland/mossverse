import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import * as gql from "../gql";
import { ApiProperty } from "@nestjs/swagger";
import { cnst, Utils } from "@shared/util";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false, default: Utils.getRandomNickname })
  @ApiProperty({ example: "Nickname", description: "Nickname of user" })
  nickname: string;

  @Field(() => gql.File, { nullable: true })
  @Prop({ type: ObjectId, required: false })
  image?: Id;

  //! Temporary Field
  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  nftImage?: string;
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID, { nullable: true })
  image?: Id;
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => ID)
  @Prop({ type: ObjectId, ref: "keyring", immutable: true, required: false })
  @ApiProperty({ example: "630e2588121191ca4b2e3ea9", description: "Keyring ID of user" })
  keyring: Id;

  @Field(() => String)
  @Prop({ type: String, enum: cnst.userRoles, default: "user", required: true })
  @ApiProperty({ example: "user", description: "role of account" })
  role: cnst.UserRole;

  @Field(() => [gql.ThingItem])
  @Prop([{ type: gql.ThingItemSchema, required: true }])
  @ApiProperty({ example: [], description: "User's Items" })
  items: gql.ThingItem[];

  @Field(() => String)
  @Prop({ type: String, enum: cnst.userStatuses, required: true, default: "active" })
  @ApiProperty({ example: "active", description: "Account status of user" })
  status: cnst.UserStatus;
}

// * 최종 생성 모델
@InputType()
export class UserInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class User extends BaseGql(Tail) {}
@Schema()
export class UserSchema extends Tail {}
