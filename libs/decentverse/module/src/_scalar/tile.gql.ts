import { Field, ObjectType, Int, InputType, ID, IntersectionType } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { CollisionSchema, CallRoomSchema, WebviewSchema, LiveSchema } from "./scalar.gql";
import { DialogueSchema } from "./dialogue.gql";
import * as gql from "../gql";
import { BaseArrayField, Id, ObjectId } from "@shared/util-server";

@ObjectType()
@InputType({ isAbstract: true })
@Schema()
export class Tile extends BaseArrayField {
  @Field(() => gql.shared.File, { nullable: true })
  @Prop({ type: ObjectId, ref: "file", required: false })
  top?: Id;

  @Field(() => gql.shared.File)
  @Prop({ type: ObjectId, ref: "file", required: true })
  bottom: Id;

  @Field(() => gql.shared.File, { nullable: true })
  @Prop({ type: ObjectId, ref: "file", required: false })
  lighting?: Id;
}
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID, { nullable: true })
  top?: Id;
  @Field(() => ID)
  bottom: Id;
  @Field(() => ID, { nullable: true })
  lighting?: Id;
}

@InputType()
export class TileInput extends IntersectionType(InputOverwrite, Tile, InputType) {}
export const TileSchema = SchemaFactory.createForClass(Tile);
