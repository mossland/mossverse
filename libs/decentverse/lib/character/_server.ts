import * as Character from "./character.document";
import { CharacterResolver } from "./character.endpoint";
import { CharacterEmployee } from "./character.employee";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Character.name, useFactory: Character.middleware() }])],
  providers: [CharacterEmployee, CharacterResolver],
  exports: [CharacterEmployee],
})
export class CharacterModule {}
