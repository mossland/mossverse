import { Global, Module, DynamicModule, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Product from "./product.model";
import { ProductService } from "./product.service";
import { ProductResolver } from "./product.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Product.name, useFactory: Product.middleware() }])],
  providers: [ProductService, ProductResolver],
  exports: [ProductService],
})
export class ProductModule {}
