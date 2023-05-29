import * as Listing from "./listing.document";
import { Global, Module } from "@nestjs/common";
import { ListingEmployee } from "./listing.employee";
import { ListingResolver } from "./listing.endpoint";
import { MongooseModule } from "@nestjs/mongoose";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Listing.name, useFactory: Listing.middleware() }])],
  providers: [ListingEmployee, ListingResolver],
  exports: [ListingEmployee],
})
export class ListingModule {}
