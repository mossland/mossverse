import { Global, Module, DynamicModule, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Token from "./token.model";
import { TokenService } from "./token.service";
import { TokenResolver } from "./token.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Token.name, useFactory: Token.middleware() }])],
  providers: [TokenService, TokenResolver],
  exports: [TokenService],
})
export class TokenModule {}
