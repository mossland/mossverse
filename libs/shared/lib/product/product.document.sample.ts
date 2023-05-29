import * as cnst from "../cnst";
import { Id } from "@util/server";
import { ProductEmployee } from "./product.employee";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const productInput = (fileId: Id): cnst.ProductInput => ({
  name: c.word(),
  description: "desc",
  image: fileId,
});

export const createProduct = async (app: TestingModule, fileId: Id) => {
  const productEmployee = app.get<ProductEmployee>(ProductEmployee);
  const product = await productEmployee.create(productInput(fileId));
  return product;
};
