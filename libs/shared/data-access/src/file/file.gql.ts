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
} from "@shared/util-client";

@InputType("FileInput")
export class FileInput {}

@ObjectType("File", { _id: "id" })
export class File extends BaseGql(FileInput) {
  @Field(() => [Int])
  imageSize: [number, number];

  @Field(() => String)
  url: string;
}

export const fileGraphQL = createGraphQL<"file", File, FileInput>(File, FileInput);
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
