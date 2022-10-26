import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const productInput = (fileId: Id): gql.ProductInput => ({
  name: c.word(),
  description: "desc",
  image: fileId,
});

export const createProduct = async (app: TestingModule, fileId: Id) => {
  const productService = app.get<srv.ProductService>(srv.ProductService);
  const product = await productService.create(productInput(fileId));
  return product;
};
