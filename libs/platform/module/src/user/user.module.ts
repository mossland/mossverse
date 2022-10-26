import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as User from "./user.model";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { UserController } from "./user.controller";

@Global()
@Module({})
export class UserModule {
  static register(isRoot?: boolean) {
    return {
      module: UserModule,
      imports: [MongooseModule.forFeatureAsync([{ name: User.name, useFactory: User.middleware() }])],
      providers: [UserService, UserResolver],
      controllers: [UserController],
      exports: isRoot ? [UserService] : [UserService],
    };
  }
}
