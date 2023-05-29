import { BaseGql, Field, InputType, Int, ObjectType, PickType, cnst, createGraphQL } from "@util/client";
import { File } from "../file/file.fetch";

@InputType("ThingInput")
export class ThingInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => File)
  image: File;

  @Field(() => String, { nullable: true })
  root: string | null;

  @Field(() => String, { nullable: true })
  rootType: string | null;
}

@ObjectType("Thing", { _id: "id" })
export class Thing extends BaseGql(ThingInput) {
  @Field(() => String)
  purpose: cnst.ThingPurpose;

  @Field(() => String)
  status: cnst.ThingStatus;

  getImageUrl() {
    return this.image?.url ?? "";
  }

  static find(things: LightThing[], name: string) {
    return things.find((thing) => thing.name === name);
  }
  static findByName(things: LightThing[], name: string) {
    return things.find((thing) => thing.name === name);
  }

  static pickByName(things: LightThing[], name: string) {
    const thing = things.find((thing) => thing.name === name);
    if (!thing) throw new Error(`Thing with name ${name} not found`);
    return thing;
  }
}

@ObjectType("LightThing", { _id: "id", gqlRef: "Thing" })
export class LightThing extends PickType(Thing, ["name", "image", "purpose", "description", "status"] as const) {}

@ObjectType("ThingSummary")
export class ThingSummary {
  @Field(() => Int)
  totalThing: number;
}

export const thingQueryMap = {
  totalThing: { status: { $ne: "inactive" } },
};

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
  crystalizeThing,
  lightCrystalizeThing,
  defaultThing,
  addThingFiles,
  mergeThing,
} = thingGraphQL;
