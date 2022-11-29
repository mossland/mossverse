import { ProductService } from "./product.service";
import { TestSystem } from "@shared/test-server";
import { ProductModule } from "./product.module";

import * as sample from "../sample";
import * as db from "../db";
import * as srv from "../srv";
import * as gql from "../gql";
import { registerModules } from "../module";
describe("Product Service", () => {
  const system = new TestSystem();
  let productService: ProductService;
  let fileService: srv.FileService;
  let file: db.File.Doc;
  beforeAll(async () => {
    const app = await system.init(registerModules);
    productService = app.get<ProductService>(ProductService);
    fileService = app.get<srv.FileService>(srv.FileService);
    [file] = await fileService.addFiles([sample.fileStream()], "product", "test");
  });
  afterAll(async () => await system.terminate());
  let product: db.Product.Doc;

  let input: gql.ProductInput;
  it("Create Product", async () => {
    input = sample.productInput(file._id);
    product = await productService.create(input);
    expect(product.status).toEqual("active");
    expect(product).toEqual(expect.objectContaining(input));
  });
  it("Update Product", async () => {
    input = sample.productInput(file._id);
    product = await productService.update(product._id, input);
    expect(product).toEqual(expect.objectContaining(input));
  });
  it("Remove Product", async () => {
    product = await productService.remove(product._id);
    expect(product.status).toEqual("inactive");
  });
});
