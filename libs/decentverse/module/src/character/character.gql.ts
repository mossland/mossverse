import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import * as gql from "../gql";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => gql.shared.Token, { nullable: true })
  @Prop({ type: ObjectId, required: false, index: true })
  token?: Id;

  @Field(() => gql.shared.Thing, { nullable: true })
  @Prop({ type: ObjectId, required: false, index: true })
  thing?: Id;

  @Field(() => gql.shared.File)
  @Prop({ type: ObjectId, required: true, ref: "file", index: true })
  file: Id;

  @Field(() => gql.shared.File, { nullable: true })
  @Prop({ type: ObjectId, required: false, ref: "file" })
  image?: Id;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  name?: string;

  @Field(() => [Int])
  @Prop([{ type: Number, required: true }])
  tileSize: number[];

  @Field(() => [Int])
  @Prop([{ type: Number, required: true }])
  totalSize: number[];

  @Field(() => [Int])
  @Prop([{ type: Number, required: true }])
  size: number[];

  @Field(() => gql.Sprite)
  @Prop({ type: gql.SpriteSchema, required: true })
  right: gql.Sprite;

  @Field(() => gql.Sprite, { nullable: true })
  @Prop({ type: gql.SpriteSchema, required: false })
  left?: gql.Sprite;

  @Field(() => gql.Sprite, { nullable: true })
  @Prop({ type: gql.SpriteSchema, required: false })
  up?: gql.Sprite;

  @Field(() => gql.Sprite, { nullable: true })
  @Prop({ type: gql.SpriteSchema, required: false })
  down?: gql.Sprite;
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID, { nullable: true })
  token?: Id;
  @Field(() => ID, { nullable: true })
  thing?: Id;
  @Field(() => ID)
  file: Id;
  @Field(() => ID, { nullable: true })
  image?: Id;
  @Field(() => gql.SpriteInput)
  right: gql.SpriteInput;
  @Field(() => gql.SpriteInput, { nullable: true })
  left?: gql.SpriteInput;
  @Field(() => gql.SpriteInput, { nullable: true })
  up?: gql.SpriteInput;
  @Field(() => gql.SpriteInput, { nullable: true })
  down?: gql.SpriteInput;
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => String)
  @Prop({
    type: String,
    enum: ["active", "inactive"],
    required: true,
    default: "active",
  })
  status: "active" | "inactive";
}

// * 최종 생성 모델
@InputType()
export class CharacterInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Character extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class CharacterSchema extends Tail {}
