import * as cnst from "../cnst";
import * as fs from "fs";
import { FileEmployee } from "../file/file.employee";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const fileStream = (): cnst.FileStream => ({
  filename: "sample.jpg",
  mimetype: "image/jpeg",
  encoding: "7bit",
  createReadStream: () => fs.createReadStream(`${__dirname}/sample.jpg`),
});

export const createFile = async (app: TestingModule) => {
  const fileEmployee = app.get<FileEmployee>(FileEmployee);
  return (await fileEmployee.addFiles([fileStream()], [{ lastModifiedAt: new Date(), size: 0 }], "test", "test"))[0];
};
