import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Product from "./product.model";
import * as fs from "fs";
import { LoadService } from "@shared/util-server";
import { Utils } from "@shared/util";
import * as db from "../db";
import * as gql from "../gql";
import { srv as external } from "@external/module";
import { FileService } from "../file/file.service";
@Injectable()
export class ProductService extends LoadService<Product.Mdl, Product.Doc, Product.Input> {
  constructor(
    @InjectModel(Product.name)
    private readonly Product: Product.Mdl,
    private readonly fileService: FileService
  ) {
    super(ProductService.name, Product);
  }
  //!remove시 유저 인벤토리에서 삭제 필요
}
