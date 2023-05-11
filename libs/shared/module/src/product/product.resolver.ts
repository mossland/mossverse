import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { ProductService } from "./product.service";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import { UseGuards } from "@nestjs/common";
import { FileService } from "../file/file.service";

@Resolver(() => gql.Product)
export class ProductResolver extends BaseResolver(
  gql.Product,
  gql.ProductInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(private readonly productService: ProductService, private readonly fileService: FileService) {
    super(productService);
  }
  @Mutation(() => [gql.File])
  @UseGuards(Allow.Admin)
  async addProductFiles(
    @Args({ name: "files", type: () => [gql.FileUpload] }) files: gql.FileUpload[],
    @Args({ name: "productId", type: () => ID, nullable: true }) productId?: string
  ) {
    return await this.fileService.addFiles(files, "product", productId);
  }
  @ResolveField(() => gql.File)
  async image(@Parent() product: gql.Product) {
    return await this.fileService.load(product.image);
  }
}
