import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Listing from "./listing.model";
import { ListingService } from "./listing.service";
import { ListingResolver } from "./listing.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Listing.name, useFactory: Listing.middleware() }])],
  providers: [ListingService, ListingResolver],
  exports: [ListingService],
})
export class ListingModule {}
