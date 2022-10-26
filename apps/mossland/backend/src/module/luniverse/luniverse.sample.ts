import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import { gql } from "./../";
import { Id } from "@shared/util-server";
import { Utils } from "@shared/util";
const c = new Chance();

export const createMocWalletInput = (address: string, user?: Id): gql.MocWalletInput => ({
  address,
  user,
});
