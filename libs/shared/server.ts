import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GraphQLModule } from "@nestjs/graphql";
import { ModulesOptions } from "./lib/option";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { join } from "path";

// * Module Imports
import { AdminModule } from "./lib/admin/_server";
import { ContractModule } from "./lib/contract/_server";
import { CurrencyModule } from "./lib/currency/_server";
import { DynamicModule } from "@nestjs/common";
import { FileModule } from "./lib/file/_server";
import { KeyringModule } from "./lib/keyring/_server";
import { NetworkModule } from "./lib/network/_server";
import { NotificationModule } from "./lib/notification/_server";
import { OwnershipModule } from "./lib/ownership/_server";
import { ProductModule } from "./lib/product/_server";
import { ScalarModule, SharedBatchModule } from "./lib/_shared/_server";
import { SecurityEmployee } from "./lib/security/security.employee";
import { SecurityModule } from "./lib/security/_server";
import { SummaryModule } from "./lib/summary/_server";
import { ThingModule } from "./lib/thing/_server";
import { TokenModule } from "./lib/token/_server";
import { UserModule } from "./lib/user/_server";
import { WalletModule } from "./lib/wallet/_server";
import {
  registerBatches as registerExternalBatches,
  registerModules as registerExternalModules,
} from "@external/server";

export { environment } from "./env/environment";
export * as doc from "./lib/doc";
export * as cnst from "./lib/cnst";
export * as emp from "./lib/emp";
export * as option from "./lib/option";
export * as sample from "./lib/sample";

export const registerModules = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    ...registerExternalModules(options, true),
    ScheduleModule.forRoot(),
    SecurityModule.register(options.security),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [],
      useFactory: async (securityEmployee: SecurityEmployee) => ({
        useGlobalPrefix: true,
        autoSchemaFile: join(process.cwd(), "src/schema.gql"),
        sortSchema: true,
        playground: options.environment.env !== "main",
        uploads: false,
        debug: false,
        context: async ({ req, res }) => {
          const { signchain, signmessage, signaddress } = req?.headers ?? {};
          const account = securityEmployee.verifyToken(req?.headers?.authorization);
          const address =
            signchain &&
            signmessage &&
            signaddress &&
            (await securityEmployee.verifySignature({
              signchain,
              signmessage,
              signaddress,
            }));
          return {
            req,
            res,
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
      inject: [SecurityEmployee],
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
    ...registerExternalBatches(options, true),
  ] as DynamicModule[];
  return modules;
};
