import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { ModulesOptions } from "./option";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";

// * Module Imports
import { module as external } from "@external/module";
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
import { NotificationModule } from "./notification/notification.module";
import { ScalarModule } from "./_scalar/scalar.module";
import { SecurityService } from "./security/security.service";
import { DynamicModule, Global, Module, Options } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { SummaryModule } from "./summary/summary.module";
import { CurrencyModule } from "./currency/currency.module";
import { OwnershipModule } from "./ownership/ownership.module";
import { SharedBatchModule } from "./sharedBatch/sharedBatch.module";

export const registerModules = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    ...external.registerModules(options, true),
    ScheduleModule.forRoot(),
    SecurityModule.register(options.security),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [],
      useFactory: async (securityService: SecurityService) => ({
        autoSchemaFile: join(process.cwd(), "src/schema.gql"),
        sortSchema: true,
        playground: options.environment.env !== "main",
        uploads: false,
        debug: false,
        context: async ({ req, connection }) => {
          const { signchain, signmessage, signaddress } = req?.headers ?? {};
          const account = securityService.verifyToken(req?.headers?.authorization);
          const address =
            signchain &&
            signmessage &&
            signaddress &&
            (await securityService.verifySignature({ signchain, signmessage, signaddress }));
          return {
            ...req,
            account,
            address,
            geolocation: req?.headers?.geolocation,
            userAgent: req?.headers?.["user-agent"],
          };
        },
        subscriptions: {
          "subscriptions-transport-ws": {
            onConnect: async (ctx: any) => {
              // service.summarizer.incrementData("activeUsers");
              // const { account } = await Authorization.verifyToken(authorization);
              // if (account?._id && account?.role === "user") service.clubMan.publishOnline(account);
              // Object.assign(context, { account });
              // return { account };
            },
            onDisconnect: async (webSocket: any, { account }: any) => {
              // service.summarizer.incrementData("activeUsers", -1);
              // if (account?._id && account?.role === "user") service.clubMan.publishOffline(account);
            },
          },
        },
      }),
      driver: ApolloDriver,
      inject: [SecurityService],
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: options.mongo.uri,
        dbName: options.mongo.dbName,
        autoIndex: options.environment.env !== "main",
      }),
    }),
    FileModule,
    NetworkModule,
    ContractModule,
    WalletModule,
    KeyringModule.register(options.security, options.environment),
    AdminModule.register(options.security),
    NotificationModule,
    ScalarModule,
    TokenModule,
    ThingModule,
    ProductModule,
    CurrencyModule,
    OwnershipModule,
    SummaryModule.register(!isChild),
    UserModule.register(!isChild),
  ] as DynamicModule[];
  return modules;
};
export const registerBatches = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    SharedBatchModule as unknown as DynamicModule,
    //
  ] as DynamicModule[];
  return modules;
};
