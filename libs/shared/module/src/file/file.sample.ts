import { TestingModule } from "@nestjs/testing";
import { FileService } from "../file/file.service";
import * as Chance from "chance";
import * as fs from "fs";
import * as gql from "../gql";
const c = new Chance();
export const fileStream = (): gql.FileStream => ({
  filename: "sample.jpg",
  mimetype: "image/jpeg",
  encoding: "7bit",
  createReadStream: () => fs.createReadStream(`${__dirname}/sample.jpg`),
});

export const createFile = async (app: TestingModule) => {
  const fileService = app.get<FileService>(FileService);
  return (await fileService.addFiles([fileStream()], "test", "test"))[0];
};
