import * as cnst from "../cnst";
import { Id } from "@util/server";
import Chance from "chance";
const c = new Chance();

export const createMocWalletInput = (address: string, user?: Id): cnst.MocWalletInput => ({
  address,
  user,
});
