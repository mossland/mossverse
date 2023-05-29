import * as Product from "./product.document";
import * as cnst from "../cnst";
import { FileEmployee } from "../file/file.employee";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { LoadService } from "@util/server";
@Injectable()
export class ProductEmployee extends LoadService<Product.Mdl, Product.Doc, Product.Input> {
  constructor(
    @InjectModel(Product.name)
    private readonly Product: Product.Mdl,
    private readonly fileEmployee: FileEmployee
  ) {
    super(ProductEmployee.name, Product);
  }
  //!remove시 유저 인벤토리에서 삭제 필요
  async summarize(): Promise<cnst.ProductSummary> {
    return {
      totalProduct: await this.Product.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
