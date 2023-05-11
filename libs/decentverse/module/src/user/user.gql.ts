import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate, mixInputType, mixObjectType } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { Role } from "../role/role.gql";
import { ApiProperty } from "@nestjs/swagger";
import { gql as shared } from "@shared/module";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => [Int], { nullable: true })
  @Prop([{ type: Number, required: true }])
  @ApiProperty({ example: [0, 0], description: "Position in metaverse" })
  currentPosition: number[];

  @Field(() => ID, { nullable: true })
  @Prop({ type: ObjectId, ref: "map", required: false })
  @ApiProperty({ example: "63167bee599b37d77cfe4351", description: "Current Map ID in metaverse" })
  currentMap?: Id;
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => [Role])
  @Prop([{ type: ObjectId, ref: "role", required: true, index: true }])
  @ApiProperty({ example: [], description: "User's roles" })
  mapRoles: Id[];
}

export type DecentverseUserInput = Base;
export type DecentverseUser = Tail;

// * 최종 생성 모델
export class UserInput {}
export interface UserInput extends shared.UserInput, InputOverwrite, Base {}
mixInputType(shared.UserInput, IntersectionType(InputOverwrite, Base, InputType));

export class User {}
export interface User extends shared.User, Base, Tail {}
mixObjectType(shared.User, IntersectionType(Base, Tail));

@Schema()
export class UserSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class DecentverseUserSummary {}
export class UserSummary {}
export interface UserSummary extends shared.UserSummary, DecentverseUserSummary {}
mixObjectType(shared.UserSummary, DecentverseUserSummary);
