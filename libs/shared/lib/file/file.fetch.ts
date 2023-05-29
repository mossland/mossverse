import {
  BaseGql,
  Field,
  InputType,
  Int,
  ObjectType,
  PickType,
  ProtoFile,
  cnst,
  createGraphQL,
  graphql,
  mutate,
} from "@util/client";

@InputType("FileInput")
export class FileInput {}

@ObjectType("File", { _id: "id" })
export class File extends BaseGql(FileInput) implements ProtoFile {
  @Field(() => String)
  filename: string;

  @Field(() => [Int])
  imageSize: [number, number];

  @Field(() => String, { nullable: true })
  url: string;

  @Field(() => Int)
  size: number;

  @Field(() => Int, { nullable: true })
  progress: number | null;

  @Field(() => String)
  status: cnst.FileStatus;
}
@ObjectType("LightFile", { _id: "id", gqlRef: "File" })
export class LightFile extends PickType(File, ["filename", "imageSize", "url", "size", "status"] as const) {}

@ObjectType("FileSummary")
export class FileSummary {
  @Field(() => Int)
  totalFile: number;
}

export const fileQueryMap = {
  totalFile: { status: { $ne: "inactive" } },
};

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
  lightFileFragment,
  purifyFile,
  crystalizeFile,
  lightCrystalizeFile,
  defaultFile,
  mergeFile,
} = fileGraphQL;

export type AddFileMutation = {
  addFile: File[];
};
export const addFileMutation = graphql`
  ${lightFileFragment}
  mutation addFile($files: [Upload!]!, $metas: [FileMeta!]!, $parentId: ID) {
    addFile(files: $files, metas: $metas, parentId: $parentId) {
      ...lightFileFragment
    }
  }
`;
export const addFile = async (files: FileList, parentId?: string) => {
  const metas = Array.from(files).map((file) => ({ lastModifiedAt: new Date(file.lastModified), size: file.size }));
  return (await mutate<AddFileMutation>(addFileMutation, { files, metas, parentId })).addFile.map((file) =>
    lightCrystalizeFile(file)
  );
};
