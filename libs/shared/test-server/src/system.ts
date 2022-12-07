import { MongoMemoryServer } from "mongodb-memory-server";
import * as mongoose from "mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongooseModule } from "@nestjs/mongoose";
import { DynamicModule, ForwardReference, Logger, Type } from "@nestjs/common";
export class TestSystem {
  mongod = new MongoMemoryServer();
  dbUri = "";
  app: TestingModule;
  async init(modules: (Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference)[]) {
    await this.mongod.start();
    this.dbUri = this.mongod.getUri();
    await mongoose.connect(this.dbUri);
    this.app = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({ useFactory: () => ({ uri: this.dbUri }) }),
        ...modules.filter((m: any) => m.module !== MongooseModule),
      ],
    }).compile();
    return await this.app.init();
  }
  async cleanup() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
  async terminate() {
    await this.app?.close();
    await mongoose.disconnect();
    await this.mongod.stop();
    Logger.log("System Terminated");
  }
}
