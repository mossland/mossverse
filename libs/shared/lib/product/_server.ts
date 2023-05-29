import * as Product from "./product.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductEmployee } from "./product.employee";
import { ProductResolver } from "./product.endpoint";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Product.name, useFactory: Product.middleware() }])],
  providers: [ProductEmployee, ProductResolver],
  exports: [ProductEmployee],
})
export class ProductModule {}
