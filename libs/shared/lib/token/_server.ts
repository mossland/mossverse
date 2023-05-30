import * as Token from "./token.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TokenEmployee } from "./token.employee";
import { TokenResolver } from "./token.endpoint";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Token.name, useFactory: Token.middleware() }])],
  providers: [TokenEmployee, TokenResolver],
  exports: [TokenEmployee],
})
export class TokenModule {}
