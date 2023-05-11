import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { gql as shared } from "@shared/module";
import { Sprite, SpriteInput, SpriteSchema } from "../_scalar/scalar.gql";
import { cnst } from "@shared/util";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => shared.File)
  @Prop({ type: ObjectId, required: true, ref: "file", index: true })
  file: Id;

  @Field(() => String)
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  description: string;

  @Field(() => [Int])
  @Prop([{ type: Number, required: true }])
  tileSize: number[];

  @Field(() => [Int])
  @Prop([{ type: Number, required: true }])
  totalSize: number[];

  @Field(() => [Int])
  @Prop([{ type: Number, required: true }])
  size: number[];

  @Field(() => Sprite)
  @Prop({ type: SpriteSchema, required: true })
  right: Sprite;

  @Field(() => shared.Token, { nullable: true })
  @Prop({ type: ObjectId, required: false, index: true })
  token?: Id;

  @Field(() => shared.Thing, { nullable: true })
  @Prop({ type: ObjectId, required: false, index: true })
  thing?: Id;

  @Field(() => shared.User, { nullable: true })
  @Prop({ type: ObjectId, required: false, ref: "user", index: true })
  creator?: Id;

  @Field(() => shared.File, { nullable: true })
  @Prop({ type: ObjectId, required: false, ref: "file" })
  image?: Id;

  @Field(() => Sprite, { nullable: true })
  @Prop({ type: SpriteSchema, required: false })
  left?: Sprite;

  @Field(() => Sprite, { nullable: true })
  @Prop({ type: SpriteSchema, required: false })
  up?: Sprite;

  @Field(() => Sprite, { nullable: true })
  @Prop({ type: SpriteSchema, required: false })
  down?: Sprite;
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID, { nullable: true })
  token?: Id;
  @Field(() => ID, { nullable: true })
  thing?: Id;
  @Field(() => ID, { nullable: true })
  creator?: Id;
  @Field(() => ID)
  file: Id;
  @Field(() => ID, { nullable: true })
  image?: Id;
  @Field(() => SpriteInput)
  right: SpriteInput;
  @Field(() => SpriteInput, { nullable: true })
  left?: SpriteInput;
  @Field(() => SpriteInput, { nullable: true })
  up?: SpriteInput;
  @Field(() => SpriteInput, { nullable: true })
  down?: SpriteInput;
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => String)
  @Prop({ type: String, enum: cnst.characterStatuses, required: true, default: "applied" })
  status: cnst.CharacterStatus;
}

// * 최종 생성 모델
@InputType()
export class CharacterInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Character extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class CharacterSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class CharacterSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalCharacter: number;
}
