import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { ModulesOptions } from "./option";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { module as external } from "@external/module";

// * Module Imports
import { AdminModule } from "./admin/admin.module";
import { FileModule } from "./file/file.module";
import { SecurityModule } from "./security/security.module";
import { TokenModule } from "./token/token.module";
import { ThingModule } from "./thing/thing.module";
import { ContractModule } from "./contract/contract.module";
import { KeyringModule } from "./keyring/keyring.module";
import { NetworkModule } from "./network/network.module";
import { WalletModule } from "./wallet/wallet.module";
import { ProductModule } from "./product/product.module";
import { ScalarModule } from "./_scalar/scalar.module";
import { SecurityService } from "./srv";
import { DynamicModule } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { CurrencyModule } from "./currency/currency.module";
import { SharedBatchModule } from "./sharedBatch/sharedBatch.module";

export {
  AdminModule,
  FileModule,
  SecurityModule,
  TokenModule,
  ThingModule,
  ContractModule,
  KeyringModule,
  NetworkModule,
  WalletModule,
  ProductModule,
  ScalarModule,
  UserModule,
};
export const registerModules = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    ...external.registerModules(options, true),
    ScheduleModule.forRoot(),
    SecurityModule.register(options.security),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      useFactory: async (securityService: SecurityService) => ({
        autoSchemaFile: join(process.cwd(), "src/schema.gql"),
        sortSchema: true,
        playground: options.environment.env !== "main",
        uploads: false,
        debug: false,
        context: async ({ req, connection }) => {
          const { signchain, signmessage, signaddress } = req?.headers ?? {};
          console.log(signmessage, signaddress);
          const account = securityService.verifyToken(req?.headers?.authorization);
          const address =
            signchain &&
            signmessage &&
            signaddress &&
            (await securityService.verifySignature({ signchain, signmessage, signaddress }));
          return { ...req, account, address };
        },
      }),
      driver: ApolloDriver,
      inject: [SecurityService],
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => ({ uri: options.mongo.uri, dbName: options.mongo.dbName }),
    }),
    ScheduleModule.forRoot(),
    FileModule,
    NetworkModule,
    ContractModule,
    WalletModule,
    KeyringModule.register(options.security),
    AdminModule.register(options.security),
    ScalarModule,
    TokenModule,
    ThingModule,
    ProductModule,
    CurrencyModule,
    UserModule.register(!isChild),
  ].filter((module) => !!module) as DynamicModule[];
  return modules;
};
export const registerBatches = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    SharedBatchModule as unknown as DynamicModule,
    //
  ].filter((module) => !!module) as DynamicModule[];
  return modules;
};
