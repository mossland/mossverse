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
  Int,
  BaseArrayFieldGql,
  PickType,
  SliceModel,
} from "@shared/util-client";
import { File, fileFragment } from "../file/file.gql";

@InputType("ThingInput")
export class ThingInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => File)
  image: File;
}

@ObjectType("Thing", { _id: "id" })
export class Thing extends BaseGql(ThingInput) {
  @Field(() => String)
  type: cnst.ThingType;

  @Field(() => String)
  status: cnst.ThingStatus;
}

@ObjectType("LightThing", { _id: "id", gqlRef: "Thing" })
export class LightThing extends PickType(Thing, ["name", "image", "status"] as const) {}

export const thingGraphQL = createGraphQL("thing" as const, Thing, ThingInput, LightThing);
export const {
  getThing,
  listThing,
  thingCount,
  thingExists,
  createThing,
  updateThing,
  removeThing,
  thingFragment,
  purifyThing,
  defaultThing,
  addThingFiles,
} = thingGraphQL;
export type ThingSlice = SliceModel<"thing", Thing, LightThing>;

@InputType("ThingItemInput")
export class ThingItemInput {
  @Field(() => Thing)
  thing: Thing;

  @Field(() => Int)
  num: number;
}
@ObjectType("ThingItem")
export class ThingItem extends BaseArrayFieldGql(ThingItemInput) {}
export const thingItemFragment = createFragment(ThingItem);
