import { DynamicModule, Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import axios from "axios";
import { MailerOptions } from "../option";
import { MailerService } from "./mailer.service";

@Global()
@Module({})
export class MailerModule {
  static register(options: MailerOptions): DynamicModule {
    return {
      module: MailerModule,
      providers: [{ provide: "MAILER_OPTIONS", useValue: options }, MailerService],
      exports: [MailerService],
    };
  }
}
