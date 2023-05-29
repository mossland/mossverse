import { ProductEmployee } from "./product.employee";
import { TestSystem } from "@shared/test-server";
import { environment } from "../env/environment";

import * as cnst from "../cnst";
import * as db from "../db";
import * as sample from "../sample";
import { registerModules } from "../server";
describe("Product Service", () => {
  const system = new TestSystem();
  let productEmployee: ProductEmployee;
  let fileEmployee: emp.FileEmployee;
  let file: db.File.Doc;
  beforeAll(async () => {
    const app = await system.init(registerModules(environment));
    productEmployee = app.get<ProductEmployee>(ProductEmployee);
    fileEmployee = app.get<emp.FileEmployee>(emp.FileEmployee);
    [file] = await fileEmployee.addFiles([sample.fileStream()], "product", "test");
  });
  afterAll(async () => await system.terminate());
  let product: db.Product.Doc;

  let input: cnst.ProductInput;
  it("Create Product", async () => {
    input = sample.productInput(file._id);
    product = await productEmployee.create(input);
    expect(product.status).toEqual("active");
    expect(product).toEqual(expect.objectContaining(input));
  });
  it("Update Product", async () => {
    input = sample.productInput(file._id);
    product = await productEmployee.update(product._id, input);
    expect(product).toEqual(expect.objectContaining(input));
  });
  it("Remove Product", async () => {
    product = await productEmployee.remove(product._id);
    expect(product.status).toEqual("inactive");
  });
});
