import * as User from "./user.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserResolver } from "./user.endpoint";
import { UserEmployee } from "./user.employee";

@Global()
@Module({})
export class UserModule {
  static register(isRoot?: boolean) {
    return {
      module: UserModule,
      imports: [MongooseModule.forFeatureAsync([{ name: User.name, useFactory: User.middleware() }])],
      providers: [UserEmployee, UserResolver],
      exports: isRoot ? [UserEmployee] : [UserEmployee],
    };
  }
}
