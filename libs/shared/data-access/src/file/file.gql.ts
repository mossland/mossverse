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
  Int,
  BaseGql,
  ProtoFile,
  PickType,
  SliceModel,
} from "@shared/util-client";

@InputType("FileInput")
export class FileInput {}

@ObjectType("File", { _id: "id" })
export class File extends BaseGql(FileInput) implements ProtoFile {
  @Field(() => [Int])
  imageSize: [number, number];

  @Field(() => String)
  url: string;
}
@ObjectType("LightFile", { _id: "id", gqlRef: "File" })
export class LightFile extends PickType(File, ["imageSize", "url"] as const) {}

export const fileGraphQL = createGraphQL("file" as const, File, FileInput, LightFile);
export const {
  getFile,
  listFile,
  fileCount,
  fileExists,
  createFile,
  updateFile,
  removeFile,
  fileFragment,
  purifyFile,
  defaultFile,
} = fileGraphQL;
export type FileSlice = SliceModel<"file", File, LightFile>;
