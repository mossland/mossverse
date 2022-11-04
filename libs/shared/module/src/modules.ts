import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { ModulesOptions } from "./options";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { verifyToken } from "@shared/util-server";

// * Module Imports
import { AdminModule } from "./admin/admin.module";
import { DiscordModule } from "./discord/discord.module";
import { FileModule } from "./file/file.module";
import { SecurityModule } from "./security/security.module";
import { TokenModule } from "./token/token.module";
import { ThingModule } from "./thing/thing.module";
import { ContractModule } from "./contract/contract.module";
import { KeyringModule } from "./keyring/keyring.module";
import { NetworkModule } from "./network/network.module";
import { WalletModule } from "./wallet/wallet.module";
import { ProductModule } from "./product/product.module";
import { ScalarModule } from "./__scalar/scalar.module";
import { SecurityService } from "./srv";
import { DynamicModule } from "@nestjs/common";
import { UserModule } from "./user/user.module";

export {
  AdminModule,
  DiscordModule,
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
    ScheduleModule.forRoot(),
    options.mongo &&
      MongooseModule.forRootAsync({
        useFactory: async () => ({ uri: options.mongo?.uri, dbName: options.mongo?.dbName }),
      }),
    options.storage && FileModule.register(options.storage),
    options.network && options.redis && NetworkModule.register(options.network, options.redis),
    ContractModule,
    WalletModule,
    KeyringModule.register(options.security),
    options.discord && DiscordModule.register(options.discord),
    AdminModule.register(options.security),
    ScalarModule,
    TokenModule,
    ThingModule,
    ProductModule,
    UserModule.register(!isChild),
  ].filter((module) => !!module) as DynamicModule[];
  return modules;
};
