import * as cnst from "../cnst";
import { Allow, BaseResolver } from "@util/server";
import { Args, ID, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { FileEmployee } from "../file/file.employee";
import { ProductEmployee } from "./product.employee";
import { UseGuards } from "@nestjs/common";

@Resolver(() => cnst.Product)
export class ProductResolver extends BaseResolver(
  cnst.Product,
  cnst.ProductInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(private readonly productEmployee: ProductEmployee, private readonly fileEmployee: FileEmployee) {
    super(productEmployee);
  }
  @Mutation(() => [cnst.File])
  @UseGuards(Allow.Admin)
  async addProductFiles(
    @Args({ name: "files", type: () => [cnst.FileUpload] })
    files: cnst.FileUpload[],
    @Args({ name: "metas", type: () => [cnst.FileMeta] })
    metas: cnst.FileMeta[],
    @Args({ name: "productId", type: () => ID, nullable: true })
    productId?: string
  ) {
    return await this.fileEmployee.addFiles(files, metas, "product", productId);
  }
  @ResolveField(() => cnst.File)
  async image(@Parent() product: cnst.Product) {
    return await this.fileEmployee.load(product.image);
  }
}
