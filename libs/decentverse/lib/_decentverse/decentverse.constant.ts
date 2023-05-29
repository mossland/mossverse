import { BaseArrayField, Id, ObjectId } from "@util/server";
import { Field, Float, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { cnst as shared } from "@shared/server";

export const filePurposes = ["asset", "character", "map", "item", "emoji"] as const;

@ObjectType()
@InputType({ isAbstract: true })
@Schema()
export class Billboard extends BaseArrayField {
  @Field(() => [Int])
  @Prop([Number])
  center: number[];

  @Field(() => [Int])
  @Prop([Number])
  wh: number[];

  @Field(() => [shared.File])
  @Prop([{ type: ObjectId, ref: "file", required: true }])
  images: Id[];

  @Field(() => shared.File)
  @Prop({ type: ObjectId, ref: "file", required: false })
  video?: Id;

  @Field(() => String)
  @Prop({ type: String })
  url: string;

  @Field(() => [Int])
  @Prop([Number])
  size: number[];
}
@InputType({ isAbstract: true })
class BillboardInput_ {
  @Field(() => [ID])
  images: Id[];

  @Field(() => ID)
  video: Id;
}
@InputType()
export class BillboardInput extends IntersectionType(BillboardInput_, Billboard, InputType) {}
export const BillboardSchema = SchemaFactory.createForClass(Billboard);

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class MapConfig {
  @Field(() => Boolean, { nullable: false })
  @Prop({ type: Boolean, required: true, default: true })
  dayNight: boolean;
}
@InputType()
export class MapConfigInput extends MapConfig {}
export const MapConfigSchema = SchemaFactory.createForClass(MapConfig);

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class SpriteDef {
  @Field(() => Int)
  @Prop({ type: Number, required: true })
  row: number;

  @Field(() => Int)
  @Prop({ type: Number, required: true })
  column: number;

  @Field(() => Int)
  @Prop({ type: Number, required: true })
  duration: number;
}

@InputType()
export class SpriteDefInput extends SpriteDef {}
export const SpriteDefSchema = SchemaFactory.createForClass(SpriteDef);

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class Sprite {
  @Field(() => SpriteDef)
  @Prop({ type: SpriteDefSchema, required: true })
  idle: SpriteDef;

  @Field(() => SpriteDef)
  @Prop({ type: SpriteDefSchema, required: true })
  walk: SpriteDef;
}

@InputType()
export class SpriteInput extends Sprite {
  @Field(() => SpriteDefInput)
  idle: SpriteDefInput;

  @Field(() => SpriteDefInput)
  walk: SpriteDefInput;
}
export const SpriteSchema = SchemaFactory.createForClass(Sprite);

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class MapPosition {
  @Field(() => String)
  @Prop({ type: String, required: true })
  key: string;

  @Field(() => [Float])
  @Prop({ type: [Number], required: true, default: [0, 0] })
  position: number[];
}
@InputType()
export class MapPositionInput extends MapPosition {}
export const MapPositionSchema = SchemaFactory.createForClass(MapPosition);
