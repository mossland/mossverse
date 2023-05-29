import { ApiProperty } from "@nestjs/swagger";
import { BaseField, Id, ObjectId, cnst } from "@util/server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { File } from "../file/file.constant";
import { Prop, Schema } from "@nestjs/mongoose";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false, default: "" })
  @ApiProperty({ example: "Nickname", description: "Nickname of user" })
  nickname: string;

  @Field(() => File, { nullable: true })
  @Prop({ type: ObjectId, required: false })
  image?: Id;

  @Field(() => [String])
  @Prop([{ type: String, enum: cnst.userRoles, required: true, index: true }])
  requestRoles: cnst.UserRole[];
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
  @Prop({ type: ObjectId, ref: "keyring", required: true })
  @ApiProperty({
    example: "630e2588121191ca4b2e3ea9",
    description: "Keyring ID of user",
  })
  keyring: Id;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, enum: cnst.userRoles, default: "user", required: true })
  @ApiProperty({ example: "user", description: "role of account" })
  role: cnst.UserRole;

  @Field(() => [String])
  @Prop([{ type: String, enum: cnst.userRoles, default: "user", required: true }])
  @ApiProperty({ example: ["user"], description: "role of account" })
  roles: cnst.UserRole[];

  @Field(() => [String])
  @Prop([{ type: String, required: true, index: true }])
  @ApiProperty({
    example: [],
    description: "User's online or playing services",
  })
  playing: string[];

  @Field(() => Date)
  @Prop({ type: Date, required: true, default: () => new Date(), index: true })
  @ApiProperty({ example: new Date(), description: "User's last login time" })
  lastLoginAt: Date;

  @Field(() => String)
  @Prop({
    type: String,
    enum: cnst.profileStatuses,
    required: true,
    default: "prepare",
  })
  profileStatus: cnst.ProfileStatus;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, required: false })
  @ApiProperty({ example: new Date(), description: "Account Restriction Due" })
  restrictUntil?: Date;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  @ApiProperty({
    example: "Sexual Harming",
    description: "Account Restriction Reason",
  })
  restrictReason?: string;

  @Field(() => String)
  @Prop({
    type: String,
    enum: cnst.userStatuses,
    required: true,
    default: "active",
  })
  @ApiProperty({ example: "active", description: "Account status of user" })
  status: cnst.UserStatus;
}

// * 최종 생성 모델
@InputType()
export class UserInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class User extends BaseField(Tail) {}
@Schema()
export class UserSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class UserSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalUser: number;

  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  restrictedUser: number;

  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  businessUser: number;

  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0 })
  hau: number;

  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0 })
  dau: number;

  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0 })
  wau: number;

  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0 })
  mau: number;
}
