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

export const thingGraphQL = createGraphQL<"thing", Thing, ThingInput>(Thing, ThingInput);
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
} = thingGraphQL;

// * Add ThingFiles Mutation
export type AddThingFilesMutation = { addThingFiles: File[] };
export const addThingFilesMutation = graphql`
  ${fileFragment}
  mutation addThingFiles($files: [Upload!]!, $thingId: String) {
    addThingFiles(files: $files, thingId: $thingId) {
      ...fileFragment
    }
  }
`;
export const addThingFiles = async (files: FileList, thingId?: string) =>
  (await mutate<AddThingFilesMutation>(addThingFilesMutation, { files, thingId })).addThingFiles;

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
